import React from 'react';
import { Link } from 'react-router';
import toReactComponent from 'jsonml-to-react-component';
import JsonML from 'jsonml.js/lib/utils';
import VideoPlayer from './VideoPlayer';
import ImagePreview from './ImagePreview';

function isHeading(node) {
  return /h[1-6]/i.test(JsonML.getTagName(node));
}

// export default doesn't work
module.exports = () => {
  return {
    converters: [
      [(node) => JsonML.isElement(node) && isHeading(node), (node, index) => {
        const headingNodeChildren = JsonML.getChildren(node);
        const headingText = headingNodeChildren.map((node) => {
          if (JsonML.isElement(node)) {
            if (JsonML.hasAttributes(node)) {
              return node[2];
            }
            return node[1];
          }
          return node;
        }).join('');
        const headingTextId = headingText.trim().replace(/\s+/g, '-');
        return React.createElement(JsonML.getTagName(node), {
          key: index,
          id: headingTextId,
          ...JsonML.getAttributes(node),
        }, [
          <span key="title">{children.map((child) => toReactComponent(child))}</span>,
          <a href={`#${headingTextId}`} className="anchor" key="anchor">#</a>,
        ]);
      }],
      [(node) => JsonML.isElement(node) && JsonML.getTagName(node) === 'video', (node, index) =>
        <VideoPlayer video={JsonML.getAttributes(node)} key={index} />,
      ],
      [(node) => JsonML.isElement(node) && JsonML.getTagName(node) === 'a' && !(
        JsonML.getAttributes(node).class ||
          (JsonML.getAttributes(node).href &&
           JsonML.getAttributes(node).href.indexOf('http') === 0) ||
          /^#/.test(JsonML.getAttributes(node).href)
      ), (node, index) => {
        return <Link to={JsonML.getAttributes(node).href} key={index}>{toReactComponent(JsonML.getChildren(node)[0])}</Link>;
      }],
      [(node) => {
        return JsonML.isElement(node) &&
          JsonML.getTagName(node) === 'p' &&
          JsonML.getTagName(JsonML.getChildren(node)[0]) === 'img' &&
          /preview-img/gi.test(JsonML.getAttributes(JsonML.getChildren(node)[0]).class);
      }, (node, index) => {
        const imgs = JsonML.getChildren(node)
                .filter((img) => JsonML.isElement(img) && Object.keys(JsonML.getAttributes(img)).length > 0)
                .map((img) => JsonML.getAttributes(img));
        return <ImagePreview imgs={imgs} key={index} />;
      }],
    ],
  };
};
