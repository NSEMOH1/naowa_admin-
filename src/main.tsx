import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from "./App"
import { AuthProvider } from './hooks/useAuth'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <ChakraProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChakraProvider>
    </CookiesProvider>
  </StrictMode>,
)
