import React from 'react';
import { Link } from 'react-router';
import toReactElement from 'jsonml-to-react-element';
import JsonML from 'jsonml.js/lib/utils';
import VideoPlayer from './VideoPlayer';
import ImagePreview from './ImagePreview';

function isHeading(node) {
  return /h[1-6]/i.test(JsonML.getTagName(node));
}

function isZhCN(pathname) {
  return /-cn\/?$/.test(pathname);
}

function makeSureComonentsLink(pathname) {
  const pathSnippets = pathname.split('#');
  if (pathSnippets[0].indexOf('/components') > -1 && !pathSnippets[0].endsWith('/')) {
    pathSnippets[0] = `${pathSnippets[0]}/`;
  }
  return pathSnippets.join('#');
}

function toZhCNPathname(pathname) {
  const pathSnippets = pathname.split('#');
  pathSnippets[0] = `${pathSnippets[0].replace(/\/$/, '')}-cn`;
  return makeSureComonentsLink(pathSnippets.join('#'));
}

function generateSluggedId(children) {
  const headingText = children.map((node) => {
    if (JsonML.isElement(node)) {
      if (JsonML.hasAttributes(node)) {
        return node[2] || '';
      }
      return node[1] || '';
    }
    return node;
  }).join('');
  const sluggedId = headingText.trim().replace(/\s+/g, '-');
  return sluggedId;
}

// export default doesn't work
module.exports = (_, props) => ({
  converters: [
    [(node) => JsonML.isElement(node) && isHeading(node), (node, index) => {
      const children = JsonML.getChildren(node);
      const sluggedId = generateSluggedId(children);
      const hash = sluggedId.replace(/[?.]$/g, '');
      return React.createElement(JsonML.getTagName(node), {
        key: index,
        id: sluggedId,
        ...JsonML.getAttributes(node),
      }, [
        <span key="title">
          {children.map((child) => toReactElement(child))}
        </span>,
        <a href={`#${hash}`} className="anchor" key="anchor">#</a>,
      ]);
    }],
    [(node) => JsonML.isElement(node) && JsonML.getTagName(node) === 'video', (node, index) => <VideoPlayer video={JsonML.getAttributes(node)} key={index} />,
    ],
    [(node) => JsonML.isElement(node) && JsonML.getTagName(node) === 'a' && !(
      JsonML.getAttributes(node).class
          || (JsonML.getAttributes(node).href
           && JsonML.getAttributes(node).href.indexOf('http') === 0)
          || /^#/.test(JsonML.getAttributes(node).href)
    ), (node, index) => {
      const { href } = JsonML.getAttributes(node);
      return (
        <Link
          to={isZhCN(props.location.pathname) ? toZhCNPathname(href) : makeSureComonentsLink(href)}
          key={index}
        >
          {toReactElement(JsonML.getChildren(node)[0])}
        </Link>
      );
    }],
    [(node) => JsonML.isElement(node)
          && JsonML.getTagName(node) === 'p'
          && JsonML.getTagName(JsonML.getChildren(node)[0]) === 'img'
          && /preview-img/gi.test(JsonML.getAttributes(JsonML.getChildren(node)[0]).class),
    (node, index) => {
      const imgs = JsonML.getChildren(node)
        .filter((img) => JsonML.isElement(img) && Object.keys(JsonML.getAttributes(img)).length > 0)
        .map((img) => JsonML.getAttributes(img));
      return <ImagePreview imgs={imgs} key={index} />;
    }],
  ],
});
