import mongoose from 'mongoose';

/**
 * MongoDB 连接缓存接口
 * 用于存储和管理多个数据库连接实例
 */
interface ConnectionCache {
  [key: string]: mongoose.Connection;
}

/**
 * MongoDB 连接选项接口
 * 定义连接数据库时的配置参数
 */
interface ConnectionOptions {
  useNewUrlParser?: boolean;       // 使用新的URL解析器（推荐）
  useUnifiedTopology?: boolean;  // 使用新的拓扑引擎（推荐）
  maxPoolSize?: number;         // 连接池最大连接数
  minPoolSize?: number;         // 连接池最小连接数
  maxIdleTimeMS?: number;       // 连接在池中的最大空闲时间（毫秒）
  serverSelectionTimeoutMS?: number; // 服务器选择超时时间（毫秒）
  connectTimeoutMS?: number;    // 连接超时时间（毫秒）
  socketTimeoutMS?: number;     // Socket超时时间（毫秒）
  retryWrites?: boolean;         // 启用重试写入操作
  bufferMaxEntries?: number;    // MongoDB 操作缓冲区最大条目数
}

/**
 * 数据库连接管理器类
 * 提供多数据库连接的缓存、管理和重用功能
 */
class MongoConnectionManager {
  private static instance: MongoConnectionManager;
  private connectionCache: ConnectionCache = {};
  private isConnected: Record<string, boolean> = {};

  /**
   * 单例模式获取连接管理器实例
   * @returns MongoConnectionManager 单例实例
   */
  public static getInstance(): MongoConnectionManager {
    if (!MongoConnectionManager.instance) {
      MongoConnectionManager.instance = new MongoConnectionManager();
    }
    return MongoConnectionManager.instance;
  }

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor() {}

  /**
   * 连接到指定的 MongoDB 数据库
   * @param uri MongoDB 连接字符串
   * @param options 连接配置选项
   * @returns Promise<mongoose.Connection> 数据库连接实例
   */
  public async connect(
    uri: string,
    options: ConnectionOptions = {}
  ): Promise<mongoose.Connection> {
    // 检查是否已有缓存连接
    if (this.connectionCache[uri]) {
      if (this.isConnected[uri]) {
        return this.connectionCache[uri];
      } else {
        // 清理无效连接
        delete this.connectionCache[uri];
        delete this.isConnected[uri];
      }
    }

    try {
      // 默认连接配置
      const defaultOptions: ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        bufferMaxEntries: 0,
      };

      // 合并用户提供的配置选项
      const connectionOptions: ConnectionOptions = {
        ...defaultOptions,
        ...options,
      };

      // 执行连接
      const connection = await mongoose.createConnection(uri, connectionOptions);

      // 连接成功事件监听
      connection.on('connected', () => {
        console.log(`✅ MongoDB 连接成功: ${uri}`);
        this.isConnected[uri] = true;
      });

      // 连接错误事件监听
      connection.on('error', (error) => {
        console.error(`❌ MongoDB 连接错误 (${uri}):`, error);
        this.isConnected[uri] = false;
        delete this.connectionCache[uri];
      });

      // 连接断开事件监听
      connection.on('disconnected', () => {
        console.warn(`⚠️ MongoDB 连接断开: ${uri}`);
        this.isConnected[uri] = false;
      });

      // 缓存连接
      this.connectionCache[uri] = connection;

      return connection;
    } catch (error) {
      console.error(`❌ MongoDB 连接失败 (${uri}):`, error);
      throw new Error(`MongoDB 连接失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取缓存的数据库连接
   * @param uri MongoDB 连接字符串
   * @returns mongoose.Connection | null 缓存的连接实例，不存在则返回 null
   */
  public getConnection(uri: string): mongoose.Connection | null {
    return this.connectionCache[uri] || null;
  }

  /**
   * 检查指定数据库是否已连接
   * @param uri MongoDB 连接字符串
   * @returns boolean 是否已连接
   */
  public isConnectionAlive(uri: string): boolean {
    return this.isConnected[uri] === true;
  }

  /**
   * 断开指定数据库连接
   * @param uri MongoDB 连接字符串
   * @returns Promise<void>
   */
  public async disconnect(uri: string): Promise<void> {
    const connection = this.connectionCache[uri];
    if (connection) {
      try {
        await connection.close();
        console.log(`🔌 MongoDB 连接已关闭: ${uri}`);
        delete this.connectionCache[uri];
        delete this.isConnected[uri];
      } catch (error) {
        console.error(`❌ 关闭 MongoDB 连接时出错 (${uri}):`, error);
        throw error;
      }
    }
  }

  /**
   * 断开所有数据库连接
   * @returns Promise<void[]>
   */
  public async disconnectAll(): Promise<void[]> {
    const disconnectPromises = Object.keys(this.connectionCache).map(uri =>
      this.disconnect(uri)
    );
    return Promise.all(disconnectPromises);
  }

  /**
   * 获取当前缓存的连接数量
   * @returns number 缓存的连接数量
   */
  public getConnectionCount(): number {
    return Object.keys(this.connectionCache).length;
  }

  /**
   * 获取所有缓存的连接 URI
   * @returns string[] 连接 URI 数组
   */
  public getActiveConnections(): string[] {
    return Object.keys(this.connectionCache);
  }

  /**
   * 清理无效连接
   * 移除所有状态为断开或无效的连接缓存
   * @returns number 清理的连接数量
   */
  public cleanup(): number {
    let cleanedCount = 0;
    const activeConnections: string[] = [];

    Object.keys(this.connectionCache).forEach(uri => {
      if (this.isConnected[uri]) {
        activeConnections.push(uri);
      } else {
        delete this.connectionCache[uri];
        delete this.isConnected[uri];
        cleanedCount++;
      }
    });

    return cleanedCount;
  }
}

// 创建全局连接管理器实例
const mongoConnectionManager = MongoConnectionManager.getInstance();

/**
 * 默认连接选项
 * 适用于大多数应用场景的优化配置
 */
const defaultConnectionOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  bufferMaxEntries: 0, // 在连接断开时不缓冲操作
};

/**
 * 连接到默认的 MongoDB 数据库
 * @param uri MongoDB 连接字符串（可选，默认从环境变量获取）
 * @param options 连接配置选项
 * @returns Promise<mongoose.Connection> 数据库连接实例
 */
export const connectToDatabase = async (
  uri?: string,
  options: ConnectionOptions = {}
): Promise<mongoose.Connection> => {
  const mongoUri = uri || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MongoDB 连接字符串未提供且 MONGODB_URI 环境变量未设置');
  }

  return mongoConnectionManager.connect(mongoUri, { ...defaultConnectionOptions, ...options });
};

/**
 * 获取默认数据库的连接
 * @returns mongoose.Connection | null 数据库连接实例，未连接则返回 null
 */
export const getDatabaseConnection = (): mongoose.Connection | null => {
  const mongoUri = process.env.MONGODB_URI;
  return mongoUri ? mongoConnectionManager.getConnection(mongoUri) : null;
};

/**
 * 检查默认数据库是否已连接
 * @returns boolean 是否已连接
 */
export const isDatabaseConnected = (): boolean => {
  const mongoUri = process.env.MONGODB_URI;
  return mongoUri ? mongoConnectionManager.isConnectionAlive(mongoUri) : false;
};

/**
 * 断开默认数据库连接
 * @returns Promise<void>
 */
export const disconnectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    return mongoConnectionManager.disconnect(mongoUri);
  }
};

// 导出连接管理器实例，供高级用法
export { mongoConnectionManager, ConnectionOptions };

// 导出类型定义（支持 TypeScript isolated modules）
export type { ConnectionCache as ConnectionCacheType };