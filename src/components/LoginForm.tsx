// Step 18: Create Login Component
import React from 'react';
import { useKindeAuth } from './hooks/useKindeAuth';

export const LoginForm: React.FC = () => {
    const { login, register, loading, error, clearError } = useKindeAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px' 
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px',
            padding: '40px',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <h2>Welcome to PaperworkPro</h2>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    backgroundColor: '#ffe6e6', 
                    padding: '10px', 
                    borderRadius: '4px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    Error: {error}
                    <button 
                        onClick={clearError}
                        style={{ 
                            marginLeft: '10px', 
                            background: 'none', 
                            border: 'none', 
                            color: 'red',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button 
                    onClick={login}
                    style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Login
                </button>
                
                <button 
                    onClick={register}
                    style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
};
