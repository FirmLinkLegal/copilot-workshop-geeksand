import React from 'react';

export function MissionControl() {
  return (
    <div className="mission-control">
      <h1>⚡ Developer Mission Control</h1>

      <hr />

      <h2>🛡️ Quality Gate: The Verification Pipeline</h2>

      <blockquote>
        <strong>CRITICAL:</strong> All changes must pass the project pre-flight check before merging.

        <pre>
          <code>
            {`# why: Ensures linting, a production build, and the test-suite all succeed before merging\nnpm run verify`}
          </code>
        </pre>
      </blockquote>

      <h3>🚦 Quick Actions</h3>
      <ul>
        <li>
          <code>npm install</code> — <em>why:</em> get all required packages for development and CI
        </li>
        <li>
          <code>npm run dev</code> — <em>why:</em> run the app locally to visually confirm UI/UX flows
        </li>
      </ul>

      <hr />

      <h3>🧪 UI Verification Table (Manual)</h3>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Action</th>
            <th>Expected Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kanban columns</td>
            <td>Open the app at <code>http://localhost:5173</code></td>
            <td>Three columns render: To Do, In Progress, Complete</td>
          </tr>
          <tr>
            <td>Add card</td>
            <td>Click <code>+ Add card</code> in a column and submit</td>
            <td>New card appears instantly and badge count increments</td>
          </tr>
          <tr>
            <td>Edit card</td>
            <td>Click ✏️, change title/body, Save</td>
            <td>Card updates inline; changes persist after reload</td>
          </tr>
          <tr>
            <td>Delete card</td>
            <td>Click 🗑️ and confirm</td>
            <td>Card is removed; badge count updates</td>
          </tr>
          <tr>
            <td>Move card</td>
            <td>Use the Move dropdown to change column</td>
            <td>Card appears in target column; badges update</td>
          </tr>
          <tr>
            <td>Persistence</td>
            <td>Reload the page</td>
            <td>All cards remain (localStorage)</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h3>🤖 Automated Testing (optional)</h3>
      <pre>
        <code>
{"# why: run Playwright tests to automate the same manual checks across environments\nnpx playwright test"}
        </code>
      </pre>

      <hr />

      <h3>Checklist — Pre-merge</h3>
      <ul>
        <li>Run <code>npm run verify</code> and fix any reported issues</li>
        <li>Manually validate critical UI flows (or run Playwright tests)</li>
        <li>Ensure new UI code includes component-level tests where appropriate</li>
      </ul>
    </div>
  );
}

export default MissionControl;
