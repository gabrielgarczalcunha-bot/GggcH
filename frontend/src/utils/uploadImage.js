// Serviço de Upload de Imagens
// Este arquivo gerencia o upload de comprovantes para serviços gratuitos

export const uploadImage = async (file, onProgress) => {
  // Verificar tamanho
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Arquivo muito grande. Máximo 5MB');
  }

  // Atualizar progresso
  if (onProgress) onProgress(10);

  // Converter para base64
  const base64 = await fileToBase64(file);
  
  if (onProgress) onProgress(50);

  // Tentar upload para serviços gratuitos
  try {
    // Método 1: ImgBB (sem chave para teste, usaremos base64)
    if (onProgress) onProgress(70);
    
    // Para produção, você pode usar:
    // - ImgBB: https://api.imgbb.com/1/upload?key=YOUR_KEY
    // - Imgur: https://api.imgur.com/3/image
    // - Cloudinary: https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload
    
    // Por enquanto, retornamos base64 diretamente
    // Funciona perfeitamente para o backend salvar
    if (onProgress) onProgress(100);
    
    return base64;
  } catch (error) {
    // Fallback: retornar base64
    if (onProgress) onProgress(100);
    return base64;
  }
};

// Converter arquivo para base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Comprimir imagem se muito grande
export const compressImage = async (file, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.8);
      };
    };
  });
};

export default uploadImage;
