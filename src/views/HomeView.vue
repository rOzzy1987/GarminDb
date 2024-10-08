<template>
  <main>
    <h1 class="title">GarminDB</h1>
    <h2 class="subtitle">Garmin ConnectIQ compatible devices</h2>
    <div class="box">
      <p class="p">Select the columns you're interested in or just export the whole table with the button on the bottom of the page</p>
      <data-grid
          :model-value="devices"
          v-model:columns="cols"
          :is-items-per-page-editable="true"
          :is-sortable="true"
          :is-export-enabled="true"
          :items-per-page="50"
          paging-footer-text="page {0} of {1}"
          items-footer-text="{0} items"
        />

      <p>&nbsp;</p>
      <p class="p text-small">If you want to thank me, buy me a coffee <a href="https://revolut.me/mihlywer">here</a></p>
    </div>
    <p>&nbsp;</p>
  </main>
</template>

<script lang="ts">

import DataGrid, { GridSelectionMode } from '@rozzy/vue-datagrid/src/DataGrid.vue';
import { GridColumnDefinition } from '@rozzy/vue-datagrid/src/GridColumnDefinition';
import { DataLoader, Formatter } from '@/bll/data';

export default {
  components: { DataGrid },
  data() {

    var devices = DataLoader.load();
    var featureList = DataLoader.getFeatureList();
    var cols = [
        new GridColumnDefinition("img", "Image", d => d.imgUrl)
          .withFormat(v => `<img src="${v}" />`)
          .withHtml(true)
          .withOptional()
          .withHidden()
          .withExportAsIs(),
        new GridColumnDefinition("name", "Device Name", d => d.name)
          .withSortForStrings(),
        new GridColumnDefinition("category", "Device category", d => d.category)
          .withSortForStrings()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("partno", "Part No?", d => d.partNumber)
          .withSortForStrings()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("screen-shape", "Shape", d => Formatter.FormatShape(d.shape))
          .withSortForStrings()
          .withAlignCenter()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("screen-colors", "Color count", d => Formatter.FormatColorCount(d.tech))
          .asNumericColumn()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("screen-tech", "Screen tech", d => Formatter.FormatTech(d.tech))
          .withSortForStrings()
          .withAlignCenter()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("screen-w", "Screen width", d => d.resolution[0])
          .asNumericColumn()
          .withOptional(),
        new GridColumnDefinition("screen-h", "Screen height", d => d.resolution[1])
          .asNumericColumn()
          .withOptional(),
        new GridColumnDefinition("version", "CIQ Version", d => d.version)
          .withSortForStrings()
          .withAlignCenter()
          .withOptional()
          .withHidden(),
        new GridColumnDefinition("system", "System level", d => d.systemLevel)
          .withSortForStrings()
          .withAlignCenter()
          .withOptional()
          .withHidden(),
      ];

    for (const fid in featureList) {
      const fval = featureList[fid];
      cols.push(new GridColumnDefinition(`feature-${fid}`, fval, d => d.features.indexOf(fid) != -1 ? "+" : "")
        .withSortForStrings()
        .withHeaderCssClasses(["is-vertical"])
        .withAlignCenter()
        .withOptional()
        .withHidden());
    }
    return {
      devices,
      cols,
      items: 50,
      GridSelectionMode
    }
  }
}

</script>