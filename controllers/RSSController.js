import Parser from 'rss-parser'

export async function runRssParser(req, res) {
    const page = req.query.page || 1
    const pageSize = 10
    try {
        const parser = new Parser()
        const feed = await parser.parseURL('https://www.kotaku.com/rss')

        const contents = feed.items.map((item) => {
            return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                image: item.content?.split('"')[3],
                content: item.contentSnippet?.split('Read more...')[0],
                tags: item.categories
                    ?.slice(0, 3)
                    .sort(() => Math.random() - 0.5)
                    .sort((a, b) => (a.length - b.length) * -1),
            }
        })

        contents.forEach((content) => {
            content['aId'] = contents.indexOf(content)
        })

        res.status(200).json({
            page: Number.parseInt(page),
            pageSize: pageSize,
            total: contents.length,
            pages: Math.ceil(contents.length / pageSize),
            articles: contents.slice((page - 1) * pageSize, page * pageSize),
        })
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}
