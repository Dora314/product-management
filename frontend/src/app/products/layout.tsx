"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Adjust path if needed
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(`Layout Effect Triggered - isLoading: ${loading} isAuthenticated: ${isAuthenticated}`); // Keep this log

    // Only run the redirect logic *after* the loading state is false
    if (!loading) {
      if (!isAuthenticated) {
        console.log("Redirecting to /login because !isAuthenticated after loading"); // Updated log
        router.push('/login');
      } else {
         console.log("User is authenticated, proceeding."); // Added log
      }
    }
  }, [isAuthenticated, loading, router]); // Add loading to dependency array

  // While the hook is checking the token, display a loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        {/* Optional: Add some text */}
        {/* <Typography sx={{ ml: 2 }}>Checking authentication...</Typography> */}
      </Box>
    );
  }

  // If loading is finished and the user is authenticated, render the page content.
  // If loading is finished and the user is not authenticated,
  // the useEffect above will trigger the redirect. Render null or a minimal layout meanwhile.
  return isAuthenticated ? <>{children}</> : null; // Or return the loading indicator again
}
