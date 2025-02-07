import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer, 
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }) // ✅ Correct foreign key usage
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }) // ✅ Fixed reference issue
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Tasks Table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade", onUpdate: "cascade" }),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }) // ✅ Fix: Added onUpdate
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
