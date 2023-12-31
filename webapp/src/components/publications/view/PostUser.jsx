import { Button, Dialog, ImageListItem, ImageListItemBar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostView from './PostView';

function PostUser(props) {
    const { ident, post, user } = props;

    const [defaultImage, setDefaultImage] = useState('');
    const [openDialogPost, setOpenDialogPost] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setDefaultImage("https://firebasestorage.googleapis.com/v0/b/travelgram-db3d8.appspot.com/o/app%2Flogos%2FfotoPorDefecto2.jpg?alt=media&token=0bae9ea3-03fb-419e-9053-84ad17ca118e");
        }
        fetchData();
    }, []);

    const handleGetPhotoPost = () => {
        return post.images[0];
    }

    const handleOpenPost = () => {
        setOpenDialogPost(true);
    }

    const handleCloseDialog = () => {
        setOpenDialogPost(false);
    }

    return (
        <>
            <ImageListItem key={ident} style={{ width: '100%', height: 0, paddingBottom: '80%', position: 'relative' }}>
                <img
                    src={post.images.length > 0 ? handleGetPhotoPost() : defaultImage}
                    alt={post.country}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
                <ImageListItemBar
                    title={post.country}
                    subtitle={post.cities.toString()}
                    actionIcon={
                        <Button key={post.id} variant="contained" size="small" color='success' onClick={() => handleOpenPost()}>Ver</Button>
                    }
                />
            </ImageListItem>
            <Dialog
                open={openDialogPost}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="80%"
            >
                <PostView post={post} sessionUser={user} savedPosts={false} />
            </Dialog>
        </>);
}

export default PostUser;