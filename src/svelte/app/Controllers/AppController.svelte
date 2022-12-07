<script context="module" lang="ts">
  // Uploads an image to S3 and returns the URL
  const uploadImage = async (
    file: File | undefined
  ): Promise<string | undefined> => {
    // If there is no file, return
    if (!file) return;

    // Read the file as a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileContent = await new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
    });

    // Send data to the server
    const response = await fetch("/api/v1/file/upload.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: reader.result as string,
        ext: file.name.split(".").pop(),
      }),
    });

    // Return the URL
    const { url } = await response.json();
    return url;
  };
</script>
