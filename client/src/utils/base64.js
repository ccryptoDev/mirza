export function getBase64(file) {
  return new Promise((resolve) => {
    let baseURL;
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader?.result
        ?.toString()
        .replace("data:", "")
        .replace(/^.+,/, "");
      resolve(baseURL);
    };
  });
}
