(async () => {
    const { Foo } = await import('./foo.js')
    Foo()
})()