interface JSONStructure {
  [key: string]: any;
}

export async function readJSONFile<T extends JSONStructure>(
  filePath: string
): Promise<T | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Wystąpił następujący błąd HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData as T;
  } catch (error) {
    console.error("Błąd odczytu pliku JSON:", error);
    return null;
  }
}
