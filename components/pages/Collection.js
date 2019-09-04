import {sync} from '@boilerplatejs/core/lib/Fetch';
import {connect} from 'react-redux';
import {Page} from '@aim-digital/web/components/layout';
import {home} from '@aim-digital/tv/data';
import {list, load} from '@boilerplatejs/strapi/actions/Entry';

const HOST = 'https://aimdigital.media';

const getHeroImage = hero => hero ? hero.url : `${HOST}/@aim-digital/web/images/logo.png`;
const formatCollectionUrl = (slug) => `${HOST}/tv${slug ? `/${slug}` : ''}`;

@sync([{
  promise: ({store: {dispatch}, params: { slug }}) => dispatch((slug ? load : list)('collections', slug ? { slug } : undefined))
}])

@connect(state => {
  const { slug } = state.router.params;
  const { name, summary, media } = slug ? state['@boilerplatejs/strapi'].Entry.collections.content : home;
  const image = getHeroImage(media && media[0]);
  const title = name ? `${name} - AIM™ TV` : 'AIM™ TV';

  return {
    className: 'post',
    title,
    meta: [
      {name: 'description', content: title},
      {property: 'og:type', content: 'article'},
      {property: 'og:url', content: formatCollectionUrl(slug)},
      {property: 'og:title', content: title},
      {property: 'og:description', content: summary},
      {property: 'og:image:secure_url', content: image},
      {property: 'og:image', content: image},
      {property: 'twitter:card', content: 'article'},
      {property: 'twitter:title', content: title},
      {property: 'twitter:description', content: summary},
      {property: 'twitter:image', content: image}
    ]
  };
})

export default class extends Page {}