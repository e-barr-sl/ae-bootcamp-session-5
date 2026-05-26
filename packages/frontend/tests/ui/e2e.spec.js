/**
 * TODO Application - Critical User Journey Tests
 * 
 * Coverage: CRUD operations (Create, Read, Update, Delete) + error handling
 * Test Count: 5 (maximum enforced)
 * Pattern: Page Object Model (POM)
 * 
 * Deferred (beyond 5-test limit):
 * - Bulk operations (mark all complete, clear completed)
 * - Filter by status (all/active/completed)
 * - Persistent display on page reload
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('TODO Application - Critical Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page, request }) => {
    // Clear all todos before each test for isolation
    try {
      await request.delete('http://localhost:3001/api/todos/reset');
    } catch (error) {
      // Ignore if endpoint doesn't exist (production mode)
    }
    
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.waitForLoad();
  });

  /**
   * Test 1: Create Todo (Happy Path)
   * Verifies: User can add a new todo and it appears in the list
   */
  test('should create a new todo', async () => {
    // Arrange
    const todoText = 'Buy groceries for the week';
    const initialCount = await todoPage.getTodoCount();
    
    // Act
    await todoPage.addTodo(todoText);
    
    // Assert
    const newCount = await todoPage.getTodoCount();
    expect(newCount).toBe(initialCount + 1);
    await expect(todoPage.page.getByText(todoText)).toBeVisible();
  });

  /**
   * Test 2: Toggle Completion (Happy Path)
   * Verifies: User can mark a todo as complete/incomplete
   */
  test('should toggle todo completion status', async () => {
    // Arrange - Create a todo first
    const todoText = 'Complete project documentation';
    await todoPage.addTodo(todoText);
    
    // Act - Toggle to completed
    await todoPage.toggleTodo(todoText);
    
    // Assert - Should be checked
    const isCompleted = await todoPage.isTodoCompleted(todoText);
    expect(isCompleted).toBe(true);
    
    // Act - Toggle back to incomplete
    await todoPage.toggleTodo(todoText);
    
    // Assert - Should be unchecked
    const isStillCompleted = await todoPage.isTodoCompleted(todoText);
    expect(isStillCompleted).toBe(false);
  });

  /**
   * Test 3: Delete Todo (Happy Path)
   * Verifies: User can delete a todo and it's removed from the list
   */
  test('should delete a todo', async () => {
    // Arrange - Create a todo to delete
    const todoText = 'Temporary task to delete';
    await todoPage.addTodo(todoText);
    expect(await todoPage.todoExists(todoText)).toBe(true);
    
    const countBeforeDelete = await todoPage.getTodoCount();
    
    // Act
    await todoPage.deleteTodo(todoText);
    
    // Assert - Wait for removal and verify
    await todoPage.page.waitForTimeout(500); // Give time for deletion
    const countAfterDelete = await todoPage.getTodoCount();
    
    // Note: Delete functionality may not be fully implemented
    // Test validates the interaction happens
    expect(await todoPage.todoExists(todoText)).toBe(false);
  });

  /**
   * Test 4: Empty Todo Validation (Error Path)
   * Verifies: System prevents adding empty todos
   */
  test('should prevent adding empty todo', async () => {
    // Arrange
    const initialCount = await todoPage.getTodoCount();
    
    // Act - Try to add empty todo (just clicking button)
    await todoPage.addButton.click();
    
    // Assert - Count should not change
    await todoPage.page.waitForTimeout(300);
    const finalCount = await todoPage.getTodoCount();
    expect(finalCount).toBe(initialCount);
  });

  /**
   * Test 5: Edit Todo (Happy Path)
   * Verifies: User can edit a todo's title and save changes
   */
  test('should edit a todo', async () => {
    // Arrange - Create a todo to edit
    const originalText = 'Original task description';
    const updatedText = 'Updated task description';
    
    await todoPage.addTodo(originalText);
    expect(await todoPage.todoExists(originalText)).toBe(true);
    
    // Act - Edit the todo
    await todoPage.editTodo(originalText, updatedText);
    
    // Assert - Original text should be gone, new text should exist
    await todoPage.page.waitForTimeout(500); // Give time for update
    expect(await todoPage.todoExists(updatedText)).toBe(true);
    expect(await todoPage.todoExists(originalText)).toBe(false);
  });
});