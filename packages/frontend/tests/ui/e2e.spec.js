/**
 * TODO Application - Critical User Journey Tests
 * 
 * Coverage: CRUD operations + error handling
 * Test Count: 5 (maximum enforced)
 * Pattern: Page Object Model (POM)
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('TODO Application - Critical Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
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
   * Test 5: Display Todos on Load (Read Operation)
   * Verifies: Existing todos are displayed when page loads
   */
  test('should display todos on page load', async () => {
    // Arrange - Add multiple todos
    const todo1 = 'First todo item';
    const todo2 = 'Second todo item';
    
    await todoPage.addTodo(todo1);
    await todoPage.addTodo(todo2);
    
    // Act - Reload the page
    await todoPage.goto();
    await todoPage.waitForLoad();
    
    // Assert - Both todos should still be visible
    await expect(todoPage.page.getByText(todo1)).toBeVisible();
    await expect(todoPage.page.getByText(todo2)).toBeVisible();
    
    const count = await todoPage.getTodoCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});