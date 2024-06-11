<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                    <li class="list-group-item">A third item</li>
                    <li class="list-group-item">A fourth item</li>
                    <li class="list-group-item">And a fifth one</li>
                </ul>
            </div>
            <div class="col-sm-4">
                <img src="../assets/things-to-do-with-books-you-will-no-longer-read-500px.jpg" class="img-fluid rounded float-end" alt="book">
            </div>
        </div>

    </div>
</template>

<script setup>

import { defineProps } from 'vue';
import { ref, computed, onMounted} from 'vue';

</script>

<style lang="scss" scoped>

</style>