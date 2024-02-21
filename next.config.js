/** @type {import('next').NextConfig} */

module.exports = {
    modularizeImports: {
        '@mui/material': {
            transform: '@mui/material/{{member}}'
        },
        '@mui/lab': {
            transform: '@mui/lab/{{member}}'
        }
    },
    images: {
        domains: ['flagcdn.com']
    },
    transpilePackages: ['react-syntax-highlighter'],
    env: {
        REACT_APP_VERSION: process.env.REACT_APP_VERSION,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_KEY,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_APP_API_URL: process.env.REACT_APP_API_URL,
        NEXT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
        NEXT_APP_JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT,
    }
};
