
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

console.log("Ebenezer Entry Point Executing...");

if (!rootElement) {
  console.error("Critical DOM Error: Root container not found.");
} else {
  try {
    const root = createRoot(rootElement);
    
    // Safety: Catch runtime errors in the component tree
    window.onerror = function(msg, url, line, col, error) {
      console.error("React Component Tree Error:", error);
      return false;
    };

    root.render(
      <React.StrictMode>
        <App onBooted={() => {
            console.log("App Component Successfully Mounted.");
            rootElement.removeAttribute('data-booting');
        }} />
      </React.StrictMode>
    );
    
    console.log("React Render Initiated.");
  } catch (error) {
    console.error("Mounting Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 
                        (typeof error === 'object' ? JSON.stringify(error) : String(error));
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available.';

    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: 'Inter', sans-serif; text-align: center; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
        <div style="background: #fff; padding: 40px; border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #fee2e2;">
          <div style="background: #fff1f2; color: #e11d48; width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h1 style="color: #1e293b; margin-top: 0; font-weight: 900; font-size: 20px;">Initialization Failure</h1>
          <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">The portal encountered a runtime error during startup. This is often caused by unresolved external modules or browser incompatibility.</p>
          <div style="text-align: left; background: #f8fafc; padding: 16px; border-radius: 16px; font-size: 10px; overflow: auto; border: 1px solid #e2e8f0; margin-bottom: 24px; font-family: monospace;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #e11d48;">Error: ${errorMessage}</p>
            <pre style="margin: 0; color: #64748b; white-space: pre-wrap; word-break: break-all;">${errorStack}</pre>
          </div>
          <button onclick="window.location.reload()" style="padding: 14px 28px; background: #2563eb; color: white; border: none; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Restart System</button>
        </div>
      </div>
    `;
  }
}
