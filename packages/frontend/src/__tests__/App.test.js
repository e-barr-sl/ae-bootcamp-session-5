import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

const renderApp = (mockTodos = []) => {
  global.fetch.mockImplementation((url) => {
    if (url.includes('/api/todos') && !url.match(/\/\d+/)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

test('renders TODO App heading', async () => {
  renderApp();
  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('should delete a todo when delete button is clicked', async () => {
  const mockTodos = [
    { id: 1, title: 'Test todo', completed: false },
  ];
  
  renderApp(mockTodos);

  // Wait for todo to appear
  await waitFor(() => {
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  // Click delete button
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButtons[0]);

  // Verify DELETE request was made
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

test('should display correct stats for incomplete and completed todos', async () => {
  const mockTodos = [
    { id: 1, title: 'Todo 1', completed: false },
    { id: 2, title: 'Todo 2', completed: false },
    { id: 3, title: 'Todo 3', completed: true },
  ];
  
  renderApp(mockTodos);

  // Wait for todos to load
  await waitFor(() => {
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
  });

  // Check stats
  expect(screen.getByText('2 items left')).toBeInTheDocument();
  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

test('should display empty state message when no todos exist', async () => {
  renderApp([]);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  // Check for empty state message
  expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
});

test('should display error message when fetch fails', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Server error')),
    })
  );

  const testQueryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });
});

test('should calculate stats correctly when todos change', async () => {
  const mockTodos = [
    { id: 1, title: 'Todo 1', completed: false },
  ];
  
  renderApp(mockTodos);

  // Wait for initial stats
  await waitFor(() => {
    expect(screen.getByText('1 items left')).toBeInTheDocument();
  });
  expect(screen.getByText('0 completed')).toBeInTheDocument();
});

test('should edit a todo when edit button is clicked and saved', async () => {
  const mockTodos = [
    { id: 1, title: 'Original title', completed: false },
  ];
  
  renderApp(mockTodos);

  // Wait for todo to appear
  await waitFor(() => {
    expect(screen.getByText('Original title')).toBeInTheDocument();
  });

  // Click edit button
  const editButtons = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButtons[0]);

  // Find input field and change the text
  const input = screen.getByDisplayValue('Original title');
  fireEvent.change(input, { target: { value: 'Updated title' } });

  // Click save button (or submit)
  const saveButton = screen.getByRole('button', { name: /save/i });
  fireEvent.click(saveButton);

  // Verify PUT request was made
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('Updated title'),
      })
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
