# Simple Library System - 统一环境配置文档

## 1. 开发环境要求

### 1.1 必需软件

| 软件 | 当前环境版本 | 说明                                |
|------|----------|-----------------------------------|
| JDK | 21.0.7   | Oracle JDK 21    |
| Maven | 3.9.10   | 项目构建工具 |
| MySQL | 8.0     |数据库服务器            |
| Git | 2.52.0   | 版本控制工具                            |
| IDE | -        | 推荐 IntelliJ IDEA Ultimate 或 Eclipse |

## 2. 技术栈

### 2.1 后端技术栈

#### 当前已配置（pom.xml）

```
Spring Boot 3.5.11
├── spring-boot-starter (核心启动器)
└── spring-boot-starter-test (测试框架)
```

#### 规划中的技术栈（待添加依赖）

```
Spring Boot 3.5.11
├── Spring Web (RESTful API) - 待添加
├── Spring Data JPA (数据持久化) - 待添加
├── Spring Validation (参数校验) - 待添加
└── Spring Boot DevTools (开发工具) - 待添加

数据库相关
├── MySQL 8.0 (主数据库) - 待配置
├── HikariCP (连接池) - Spring Boot 默认集成
└── Flyway / Liquibase (数据库版本管理，可选)

工具库
├── Lombok (简化代码) - 待添加
├── MapStruct (对象映射) - 待添加
├── Hutool (工具类库) - 待添加
└── Swagger / SpringDoc (API 文档) - 待添加

日志
├── SLF4J + Logback (Spring Boot 默认集成) ✓
└── 日志文件滚动策略 - 待配置
```


### 2.2 前端技术栈

#### node js 版本: 22.16

```  
Vue 3.22 
├── Axios (HTTP 客户端)  
├── Element Plus  
└── Vue Router
```

