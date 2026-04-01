import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users (staff, admin, customers)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: text('role', { enum: ['customer', 'kitchen', 'admin'] }).default('customer'),
  cafeId: text('cafe_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// OTP store (short-lived, cleaned up after use)
export const otpCodes = sqliteTable('otp_codes', {
  email: text('email').primaryKey(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Cafes (multi-tenant)
export const cafes = sqliteTable('cafes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logoUrl: text('logo_url'),
  themeJson: text('theme_json').default('{}'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Tables
export const tables = sqliteTable('tables', {
  id: text('id').primaryKey(),
  cafeId: text('cafe_id').notNull().references(() => cafes.id),
  tableNumber: integer('table_number').notNull(),
  qrCodeUrl: text('qr_code_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

// Menu Categories
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  cafeId: text('cafe_id').notNull().references(() => cafes.id),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').default(0),
});

// Menu Items
export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey(),
  cafeId: text('cafe_id').notNull().references(() => cafes.id),
  categoryId: text('category_id').references(() => categories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  imageUrl: text('image_url'),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
  sortOrder: integer('sort_order').default(0),
});

// Orders
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  cafeId: text('cafe_id').notNull().references(() => cafes.id),
  tableId: text('table_id').references(() => tables.id),
  tableNumber: integer('table_number'),
  customerName: text('customer_name'),
  status: text('status', { enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'] }).default('pending'),
  totalAmount: real('total_amount'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Order Items
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  name: text('name').notNull(), // snapshot at time of order
  price: real('price').notNull(), // snapshot at time of order
  quantity: integer('quantity').notNull().default(1),
  notes: text('notes'),
});
