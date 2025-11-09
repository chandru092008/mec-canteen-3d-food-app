import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  fullName: text('full_name').notNull(),
  studentId: text('student_id').unique(),
  phone: text('phone'),
  walletBalance: real('wallet_balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// Food items table
export const foodItems = sqliteTable('food_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url'),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
  isCombo: integer('is_combo', { mode: 'boolean' }).notNull().default(false),
  comboItems: text('combo_items', { mode: 'json' }),
  preparationTime: integer('preparation_time'),
  createdAt: text('created_at').notNull(),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  totalAmount: real('total_amount').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'),
  orderStatus: text('order_status').notNull().default('pending'),
  pickupCode: text('pickup_code').unique(),
  items: text('items', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  foodItemId: integer('food_item_id').notNull().references(() => foodItems.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  customizations: text('customizations', { mode: 'json' }),
});