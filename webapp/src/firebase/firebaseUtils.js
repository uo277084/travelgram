import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';

const uploadImagesToPublication = async (images, publicationId) => {
    const storage = getStorage();
    const imageUrls = [];

    try {
        const publicationPath = `publications/${publicationId}`;

        for (const image of images) {
            const uniqueName = image.name;

            const imagePath = `${publicationPath}/${uniqueName}`;

            const storageRef = ref(storage, imagePath);
            await uploadBytes(storageRef, image);

            const downloadUrl = await getDownloadURL(storageRef);
            imageUrls.push(downloadUrl);
        }
        return imageUrls;
    } catch (error) {
        console.error('Error al cargar imágenes de publicación a Firebase Storage:', error);
        throw error;
    }
};

const uploadUserProfileImage = async (image, userId) => {
    const storage = getStorage();

    try {
        const userPath = `users/${userId}`;

        const profileImagePath = `${userPath}/fotoPerfil`;

        const storageRef = ref(storage, profileImagePath);
        await uploadBytes(storageRef, image);

        return getDownloadURL(storageRef);
    } catch (error) {
        console.error('Error al cargar la foto de perfil del usuario a Firebase Storage:', error);
        throw error;
    }
};

const removeUserProfileImage = async (userId) => {
    const storage = getStorage();

    try {
        const userPath = `users/${userId}/fotoPerfil`;

        const storageRef = ref(storage, userPath);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error al eliminar la foto de perfil del usuario de Firebase Storage:', error);
        throw error;
    }
}

const removePublicationPhotos = async (publicationId) => {
    const storage = getStorage();

    const publicationPath = `publications/${publicationId}`;

    const storageRef = ref(storage, publicationPath);
    const photos = await listAll(storageRef);

    //Borramos las fotos 
    for (const item of photos.items) {
        await deleteObject(item).catch((error) => {
            console.error('Error al eliminar archivo:', error);
        });
    }

    //Borramos la carpeta
    await deleteObject(storageRef).catch((error) => {
        console.error('Error al eliminar carpeta:', error);
    });
}

const getPhoto = async (path) => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
}

const firebaseUtils = { uploadImagesToPublication, uploadUserProfileImage, getPhoto, removeUserProfileImage, removePublicationPhotos };

export default firebaseUtils;