// Simple link tracking
document.addEventListener('DOMContentLoaded', () => {
  console.log('Linktree clone loaded!');

  // Get all link items
  const linkItems = document.querySelectorAll('.link-item');

  // Add click event to each link
  for (const link of linkItems) {
    link.addEventListener('click', () => {
      // In a real app, this would send analytics data
      console.log(`Link clicked: ${(link as HTMLElement).querySelector('.link-title')?.textContent}`);
    });
  }
});
