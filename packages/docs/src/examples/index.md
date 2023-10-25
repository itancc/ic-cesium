---
page: true
title: Examples
aside: false
footer: false
outline: false
prev: false
next: false
pageClass: examples-page-class
---

<script setup>
import { defineAsyncComponent } from 'vue'

const ExampleRepl = defineAsyncComponent({
    loader: () => import('./Repl.vue'),
})
</script>

<ClientOnly>
    <ExampleRepl />
</ClientOnly>
