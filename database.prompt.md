## 数据库模型创建prompt

**你需要创建三个文件**
1. `event.model.ts`
2. `booking.model.ts`
3. `index.ts`

### 1. `database/event.model.ts`
创建一个强类型的Mongoose schema和model 名称为**Event** 然后这个类型中包含的字段有：
- `title` - string, required
- `slug` - string, unique, auto-generation from title
- `description` - string, required
- `overview` - string, required
- `image` - string, required
- `venue` - string, required
- `location` - string, required
- `date` - string, required
- `time` - string, required
- `mode` - string, (e.q., online, offline, hybird), required
- `audience` - string, required
- `agenda` - arrray of strings, required
- `organizer` - string, required
- `tags` - arrray of strings, required
- `createdAt` - date, auto-generated
- `updatedAt` - date, auto-generated

**需求**
- 使用**pre-save hook** 从标题自动生成对 URL 友好的别名（slug）。
- 仅当标题更改时重新生成别名。在同一个预保存钩子中，验证并规范化 “日期”为 ISO 格式，并确保 “时间” 以一致的格式存储。
- 验证所有必填字段是否存在且非空。
- 为别名添加唯一索引。
- 启用自动时间戳。
- 使用严格的 TypeScript 类型（不使用 any）。编写简洁的注释，解释别名生成、日期格式化和验证等关键逻辑。

### 2. `database/booking.model.ts`
创建一个强类型的Mongoose schema和model 名称为**Booking** 然后这个类型中包含的字段有：
- `eventId` - ObjectId (reference to `Event`), required
- `email` - string, required, must be a valid email
- `createdAt` - date, auto-generated
- `updatedAt` - date, auto-generated

**需求**
- 在预保存钩子中，验证引用的eventId是否对应一个存在的Event。如果该事件不存在，抛出错误。
- 验证email格式是否正确。
- 为eventId添加索引以加快查询速度。
- 启用自动时间戳。
- 全程使用严格的 TypeScript 类型。
- 包含简洁的注释，解释预保存验证和模式设计决策。

### 3. `database/index.ts`

- 为了能够让`Event`和`Booking` 这两个类型通过一个文件可以在项目的任意位置被引入

---

**最后的提示**
- 只有三个文件被创建：`event.model.ts`, `booking.model.ts`, `index.ts`
- 每一个模型都必须使用**pre-save hooks** 来创建 slug，规范化日期以及进行模型之间的关联引用的验证
- 代码应该是生产环境级别的，简洁，类型安全，然后容易理解
- 包含必要的简洁的注释，不必要的注释不要添加