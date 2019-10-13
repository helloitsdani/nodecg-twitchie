import TwitchClient from 'twitch';
import TwitchChatClient from 'twitch-chat-client';
interface TwitchieClientAuthProps {
    username: string;
    token: string;
}
declare class TwitchieClientWrapper {
    client?: TwitchChatClient;
    api?: TwitchClient;
    auth?: TwitchieClientAuthProps;
    isConnected: () => boolean;
    disconnect: () => Promise<void>;
    connect: (auth: TwitchieClientAuthProps) => Promise<void>;
}
export { TwitchieClientWrapper };
declare const _default: TwitchieClientWrapper;
export default _default;
