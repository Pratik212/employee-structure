// This is your Swagger UI page with proper styling and "Try it out" functionality enabled
"use client";

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
    useEffect(() => {
        // Apply custom styles to fix dark mode issues
        const style = document.createElement('style');
        style.innerHTML = `
      .swagger-ui {
        background-color: white;
        color: #3b4151;
      }
      .swagger-ui .info .title,
      .swagger-ui .info h1, 
      .swagger-ui .info h2, 
      .swagger-ui .info h3, 
      .swagger-ui .info h4, 
      .swagger-ui .info h5, 
      .swagger-ui .info a,
      .swagger-ui .scheme-container,
      .swagger-ui .opblock-tag,
      .swagger-ui table thead tr td, 
      .swagger-ui table thead tr th,
      .swagger-ui .parameter__name,
      .swagger-ui .parameter__type,
      .swagger-ui .parameter__deprecated,
      .swagger-ui .parameter__in,
      .swagger-ui .tab,
      .swagger-ui .response-col_status,
      .swagger-ui .response-col_description,
      .swagger-ui .response-col_links,
      .swagger-ui .opblock .opblock-section-header h4,
      .swagger-ui .opblock .opblock-section-header,
      .swagger-ui .opblock .opblock-summary-path,
      .swagger-ui .opblock .opblock-summary-description,
      .swagger-ui .opblock .opblock-summary-method,
      .swagger-ui .opblock-description-wrapper p,
      .swagger-ui .responses-inner h4,
      .swagger-ui .responses-inner h5,
      .swagger-ui .model-title,
      .swagger-ui .model,
      .swagger-ui .renderedMarkdown p,
      .swagger-ui input,
      .swagger-ui label {
        color: #3b4151 !important;
      }
      .swagger-ui textarea {
        background-color: white;
        color: #3b4151;
      }
      .swagger-ui .topbar {
        background-color: #1b1b1b;
      }
      .swagger-ui .opblock-tag small {
        color: #656b75 !important;
      }
      .swagger-ui .btn {
        color: #3b4151 !important;
      }
      .swagger-ui .dialog-ux .modal-ux {
        background: white;
        color: #3b4151;
      }
      .swagger-ui .dialog-ux .modal-ux-header h3 {
        color: #3b4151;
      }
      body {
        background-color: white;
        margin: 0;
        padding: 0;
      }
    `;
        document.head.appendChild(style);
    }, []);

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
            <SwaggerUI
                url="/api/swagger"
                docExpansion="list"
                deepLinking={true}
                displayRequestDuration={true}
                filter={true}
                showCommonExtensions={true}
                requestInterceptor={(req) => {
                    // Add custom headers if needed
                    return req;
                }}
                responseInterceptor={(res) => {
                    // Process responses if needed
                    return res;
                }}
                defaultModelsExpandDepth={5}
                defaultModelExpandDepth={5}
                validatorUrl={null}
                tryItOutEnabled={true} // Explicitly enable "Try it out" feature
            />
        </div>
    );
}