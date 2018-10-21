import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
    width: 100%;
    display: block;
`;

const VideoStream = () => ({
    render() {
        return (
            <VideoWrapper>
                <iframe
                    src="https://player.twitch.tv/?autoplay=false&video=v325080116"
                    frameborder="0"
                    allowfullscreen="true"
                    scrolling="no"
                    height="378"
                    width="620"
                ></iframe>
                {/* <a href="https://www.twitch.tv/videos/325080116?tt_content=text_link&tt_medium=vod_embed" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch SpaceAppsNYC | Hackathon | Spot That Fire from tgb_hex on www.twitch.tv</a> */}
            </VideoWrapper>
        );
    }
});

export default VideoStream;