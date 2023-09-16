export default function slugify(str: string): string {
	// Convert string to lowercase
	str = str.toLowerCase();

	// Trim the string
	str = str.trim();

	// Allow only spaces, a-z, and numbers
	str = str.replace(/[^a-z0-9 ]/g, '');

	// Remove double spaces
	str = str.replace(/\s+/g, ' ');

	// Replace spaces with hyphens
	str = str.replace(/ /g, '-');

	return str;
}
