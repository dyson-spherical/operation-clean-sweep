<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <h1 class="text-8xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <router-link to="/"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
        Go Home
      </router-link>
    </div>
  </div>
</template>
