"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * ProptypesRemover class removes static propTypes getters in production builds.
 */
class ProptypesRemover {
  /**
   * Gets the plugin object itself.
   *
   * @see https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-writing-your-first-babel-plugin
   * @param {object} babel The current `babel` object.
   * @return {object} The plugin object.
   */
  getPluginObject({
    types: t
  }) {
    if (!t) {
      this._error(new TypeError('The first argument must be the current babel object.'));

      return {};
    }

    return {
      visitor: {
        ClassMethod: path => {
          if (!this._shouldRemoveProptypes()) {
            return;
          }

          const {
            node
          } = path;

          if (node && node.key && node.key.name === 'propTypes' && node.static && node.kind === 'get') {
            path.remove();
          }
        }
      }
    };
  }
  /**
   * Checks if this plugin should remove propTypes.
   *
   * @param {string} [environment=process.env.NODE_ENV] The environment.
   * @return {boolean} `true` when it should remove propTypes, otherwise
   *         `false`.
   */


  _shouldRemoveProptypes(environment = process.env.NODE_ENV) {
    if (!environment || typeof environment !== 'string') {
      this._error(new TypeError('Argument environment must be a string.'));

      return false;
    }

    return ['prod', 'production'].includes(environment);
  }
  /**
   * Outputs an error message.
   *
   * @param {...*} message An error message.
   */


  _error(message) {
    console.error(...message);
  }

}

const remover = exports.remover = new ProptypesRemover();
exports.default = remover.getPluginObject.bind(remover);