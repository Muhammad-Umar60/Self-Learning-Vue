import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'


// // Test structure function
// describe('group name', () => {})  // groups related tests together
// it('test name', () => {})         // single test (same as test())
// test('test name', () => {})       // same as it()

// // Lifecyle Function
// beforeEach(() => {})   // runs BEFORE every test in describe block
// afterEach(() => {})    // runs AFTER every test
// beforeAll(() => {})    // runs ONCE before ALL tests
// afterAll(() => {})     // runs ONCE after ALL tests

// // Expect/Assertion Functions
// expect(value).toBe(5)              // strict equality ===
// expect(value).toEqual({a: 1})      // deep equality (objects/arrays)
// expect(value).toBeTruthy()         // is truthy?
// expect(value).toBeFalsy()          // is falsy?
// expect(value).toBeNull()           // is null?
// expect(value).toHaveLength(3)      // array/string length
// expect(value).toContain('text')    // array/string contains
// expect(fn).toThrow()               // function throws error?
// expect(value).toBeGreaterThan(3)   // number comparison
// expect(value).toBeLessThan(10)     // number comparison
// expect(mock).toHaveBeenCalled()    // was function called?
// expect(mock).toHaveBeenCalledWith(arg) // called with specific arg?

// // Vue Test Utils Functions
// // MOUNTING
// mount(Component, options)        // full mount with children
// shallowMount(Component, options) // mount WITHOUT child components

// // // OPTIONS you can pass
// // {
// //   props: { product: mockProduct },  // pass props
// //   global: {
// //     plugins: [pinia, router],       // register plugins
// //     stubs: { RouterLink: true },    // stub child components
// //     mocks: { $router: mockRouter }  // mock globals
// //   }
// // }

// // WRAPPER METHODS (what mount returns)
// wrapper.text()                    // all text content
// wrapper.html()                    // full HTML
// wrapper.find('button')            // find first element
// wrapper.findAll('li')             // find all elements
// wrapper.trigger('click')          // trigger event (async!)
// wrapper.setValue('hello')         // set input value (async!)
// wrapper.props()                   // get component props
// wrapper.emitted()                 // get emitted events
// wrapper.emitted('order')          // get specific event
// wrapper.exists()                  // does element exist?
// wrapper.isVisible()               // is element visible?
// wrapper.classes()                 // get CSS classes


describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('You did it!')
  })
})