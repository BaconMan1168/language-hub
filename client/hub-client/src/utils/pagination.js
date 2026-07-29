export function getTotalPages(totalItems, itemsPerPage) {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

export function clampPage(currentPage, totalItems, itemsPerPage) {
  return Math.min(
    Math.max(currentPage, 1),
    getTotalPages(totalItems, itemsPerPage)
  );
}

export function getPageItems(items, currentPage, itemsPerPage) {
  const page = clampPage(currentPage, items.length, itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;

  return items.slice(startIndex, startIndex + itemsPerPage);
}
