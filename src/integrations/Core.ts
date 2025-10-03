export async function UploadFile({ file }: { file: globalThis.File }): Promise<{ file_url: string }> {
  // TODO: Implement actual file upload logic
  // This is a placeholder that simulates file upload
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        file_url: URL.createObjectURL(file)
      });
    }, 1000);
  });
}
