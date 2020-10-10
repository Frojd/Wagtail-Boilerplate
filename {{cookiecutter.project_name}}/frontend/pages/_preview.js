import { getPagePreview } from '../api/wagtail';
export { default } from './[...path]';

const isProd = process.env.NODE_ENV === 'production';

export async function getServerSideProps({ req, preview, previewData }) {
    if (!preview) {
        // TODO: Serve 404 component
        return { props: {} };
    }

    const { contentType, token } = previewData;

    // TODO: Add proper token verification and error message
    try {
        const pagePreviewData = await getPagePreview(contentType, token, {
            headers: {
                cookie: req.headers.cookie,
            },
        });
        return {
            props: pagePreviewData,
        };
    } catch (err) {
        if (!isProd && err.response.status >= 500) {
            const html = await err.response.text();
            return {
                props: {
                    componentName: 'PureHtmlPage',
                    componentProps: { html },
                },
            };
        }

        throw err;
    }
}