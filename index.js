const request = require('request-promise');
const cheerio = require('cheerio');

(async() => {

    const USERNAME = 'willsmith';
    const BASE_URL = `https://instagram.com/${USERNAME}`;

    let response = await request(BASE_URL);

    let $ = cheerio.load(response);

    // eq(3) because I want the fourth script tag
    let script = $('script[type="text/javascript"]').eq(3).html();

    let script_regex = /window._sharedData = (.+);/g.exec(script);

    let { entry_data: { ProfilePage: { [0]: { graphql: { user } } } } } = JSON.parse(script_regex[1]);

    // Scraping posts
    let { entry_data: { ProfilePage: { [0]: { graphql: { user: { edge_owner_to_timeline_media: { edges } } } } } } } = JSON.parse(script_regex[1]);

    let posts = [];

    for (let edge of edges) {
        let { node } = edge;

        posts.push({
            id: node.id,
            shortcode: node.shortcode,
            timestamp: node.taken_at_timestamp,
            likes: node.edge_liked_by.count,
            comments: node.edge_media_to_comment.count,
            video_views: node.video_view_count,
            caption: node.edge_media_to_caption.edges[0].node.text,
            image_url: node.display_url
        });

    }

    let instagram_data = {
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count,
        uploads: user.edge_owner_to_timeline_media.count,
        full_name: user.full_name,
        picture_url: user.profile_pic_url_hd,
        posts
    }

    console.log(instagram_data);
})()