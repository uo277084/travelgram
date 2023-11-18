import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddPublication from '.././publications/create/AddPublication';
import SavedPosts from '.././publications/saved/SavedPosts';
import Chats from '../chats/Chats';
import ErrorConnection from '../error/ErrorConnection';
import ErrorNotFound from '../error/ErrorNotFound';
import Home from '../home/Home';
import LoginView from '../login/LoginView';
import FollowedPosts from '../publications/follows/FollowedPosts';
import RegisterView from '../register/RegisterView';
import ConfigView from '../user/configuration/ConfigView';
import FeedUser from '../user/feed/FeedUser';

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/home" element={<Home />} />
                <Route path='/addPublication' element={<AddPublication />} />
                <Route path="/feed" element={<FeedUser />} />
                <Route path="/feed/:username" element={<FeedUser />} />
                <Route path="/savedPosts" element={<SavedPosts />} />
                <Route path="/followed" element={<FollowedPosts />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/chats/:username" element={<Chats />} />
                <Route path="/config" element={<ConfigView />} />
                <Route path="/error" element={<ErrorConnection />} />
                <Route path="*" element={<ErrorNotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
