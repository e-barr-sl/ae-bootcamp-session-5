/**
 * TodoPage - Page Object Model for TODO application
 * Centralizes selectors and reusable actions for UI tests
 */
export class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors - Accessibility-first approach
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoItems = page.getByRole('listitem');
    this.loadingSpinner = page.getByRole('progressbar');
  }

  /**
   * Navigate to the TODO application
   */
  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to be ready (no loading spinner)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a new todo item
   * @param {string} title - The todo title
   */
  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    
    // State-based wait: verify todo appears in list
    await this.page.waitForSelector(`text="${title}"`, { state: 'visible' });
  }

  /**
   * Get count of todo items
   * @returns {Promise<number>} Number of todos
   */
  async getTodoCount() {
    // Wait a moment for list to update
    await this.page.waitForTimeout(100);
    return await this.todoItems.count();
  }

  /**
   * Toggle completion status of a todo
   * @param {string} title - The todo title to toggle
   */
  async toggleTodo(title) {
    const todo = this.page.getByRole('listitem').filter({ hasText: title });
    const checkbox = todo.getByRole('checkbox');
    await checkbox.click();
  }

  /**
   * Check if a todo is marked as completed
   * @param {string} title - The todo title to check
   * @returns {Promise<boolean>} True if completed
   */
  async isTodoCompleted(title) {
    const todo = this.page.getByRole('listitem').filter({ hasText: title });
    const checkbox = todo.getByRole('checkbox');
    return await checkbox.isChecked();
  }

  /**
   * Delete a todo item
   * @param {string} title - The todo title to delete
   */
  async deleteTodo(title) {
    const todo = this.page.getByRole('listitem').filter({ hasText: title });
    const deleteButton = todo.getByRole('button', { name: /delete/i });
    await deleteButton.click();
  }

  /**
   * Check if a todo exists in the list
   * @param {string} title - The todo title to find
   * @returns {Promise<boolean>} True if todo exists
   */
  async todoExists(title) {
    const count = await this.page.getByText(title, { exact: true }).count();
    return count > 0;
  }

  /**
   * Wait for the app to finish loading
   */
  async waitForLoad() {
    // Wait for loading spinner to disappear
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    } catch (e) {
      // Spinner might not appear if data loads fast
    }
  }
}
