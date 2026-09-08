import { io } from 'socket.io-client';
import { baseSocketURL } from '../Api/Api';

export const socket = io(baseSocketURL);
