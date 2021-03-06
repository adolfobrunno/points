import BaseInput from './baseInput'
import Util from './util'

const BaseSelection = (($) => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const Default = {
    label: {
      required: false

      // Prioritized find order for resolving the label to be used as an mdb-label if not specified in the markup
      //  - a function(thisComponent); or
      //  - a string selector used like $mdbFormGroup.find(selector)
      //
      // Note this only runs if $mdbFormGroup.find(Selector.MDB_LABEL_WILDCARD) fails to find a label (as authored in the markup)
      //
      //selectors: [
      //  `.form-control-label`, // in the case of horizontal or inline forms, this will be marked
      //  `> label` // usual case for text inputs
      //]
    }
  }

  const Selector = {
    LABEL: 'label'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */
  class BaseSelection extends BaseInput {

    constructor($element, config, properties) {
      // properties = {inputType: checkbox, outerClass: checkbox-inline}
      // '.checkbox|switch|radio > label > input[type=checkbox|radio]'
      // '.${this.outerClass} > label > input[type=${this.inputType}]'

      super($element, $.extend(true, {}, Default, config), properties)
      this.decorateMarkup()
    }

    // ------------------------------------------------------------------------
    // protected

    decorateMarkup() {
      this.$element.after(this.config.template)
    }

    // Demarcation element (e.g. first child of a form-group)
    outerElement() {
      // .checkbox|switch|radio > label > input[type=checkbox|radio]
      // label.checkbox-inline > input[type=checkbox|radio]
      // .${this.outerClass} > label > input[type=${this.inputType}]
      return this.$element.parent().closest(`.${this.outerClass}`)
    }

    rejectWithoutRequiredStructure() {
      // '.checkbox|switch|radio > label > input[type=checkbox|radio]'
      // '.${this.outerClass} > label > input[type=${this.inputType}]'
      Util.assert(this.$element, !this.$element.parent().prop('tagName') === 'label', `${this.constructor.name}'s ${Util.describe(this.$element)} parent element should be <label>.`)
      Util.assert(this.$element, !this.outerElement().hasClass(this.outerClass), `${this.constructor.name}'s ${Util.describe(this.$element)} outer element should have class ${this.outerClass}.`)
    }

    addFocusListener() {
      // checkboxes didn't appear to bubble to the document, so we'll bind these directly
      this.$element.closest(Selector.LABEL).hover(() => {
        this.addFormGroupFocus()
      }, () => {
        this.removeFormGroupFocus()
      })
    }

    addChangeListener() {
      this.$element.change(() => {
        this.$element.blur()
      })
    }

    // ------------------------------------------------------------------------
    // private
  }

  return BaseSelection

})(jQuery)

export default BaseSelection
