import { atomWithStorage } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';

export type Language = 'en' | 'es';

export const languageAtom = atomWithStorage<Language>(
  'geovizor.language',
  'en'
);

type Vars = Record<string, string | number>;

const es: Record<string, string> = {
  // Shell
  'Map workspace': 'Espacio de trabajo',
  FeatureCollection: 'FeatureCollection',
  Import: 'Importar',
  Export: 'Exportar',
  Share: 'Compartir',
  Basemap: 'Mapa base',
  'About geovizor': 'Acerca de geovizor',
  'Change basemap': 'Cambiar mapa base',
  'Map editor': 'Editor de mapas',
  Workspace: 'Espacio de trabajo',
  'Start mapping': 'Empieza a mapear',
  'Draw features on the map with the tools on the left, or import an existing dataset to begin editing.':
    'Dibuja features en el mapa con las herramientas de la izquierda o importa un conjunto de datos para empezar a editar.',
  'Quick start': 'Inicio rápido',
  'Import data': 'Importar datos',
  'Supported file types': 'Tipos de archivo compatibles',
  'Tip: press 2–6 to switch drawing tools.':
    'Consejo: pulsa 2–6 para cambiar de herramienta.',
  'Drag and drop files anywhere on the map.':
    'Arrastra y suelta archivos sobre el mapa.',
  'Loading map workspace...': 'Cargando espacio de trabajo...',

  // Modes
  Select: 'Seleccionar',
  Use: 'Usar',
  Expand: 'Expandir',
  Minimize: 'Minimizar',
  'feature selected': 'feature seleccionada',
  'Click and drag to draw a circle':
    'Haz clic y arrastra para dibujar un círculo',
  'Draw point': 'Dibujar punto',
  'Draw line': 'Dibujar línea',
  'Draw polygon': 'Dibujar polígono',
  'Draw rectangle': 'Dibujar rectángulo',
  'Draw circle': 'Dibujar círculo',
  'Circle type': 'Tipo de círculo',
  Help: 'Ayuda',
  'Union features': 'Unir features',
  '1 feature selected': '1 feature seleccionada',
  '{count} features selected': '{count} features seleccionadas',
  'Hold space bar & drag to move entire features. Hold option & drag to rotate.':
    'Mantén espacio y arrastra para mover las features. Mantén Opción y arrastra para rotarlas.',
  'Hold Option to snap to existing features, Option+Shift to snap to vertices.':
    'Mantén Opción para ajustar a features existentes; Opción+Mayús para ajustar a vértices.',
  'Hold Shift to snap to right angles.':
    'Mantén Mayús para ajustar a ángulos rectos.',
  'Click and drag to draw a rectangle':
    'Haz clic y arrastra para dibujar un rectángulo',
  'Lift the mouse button to finish':
    'Suelta el botón del ratón para terminar',
  'Click to start the polygon, then click to add each vertex':
    'Haz clic para iniciar el polígono y luego añade cada vértice',
  'Finish by clicking the starting point, double-clicking or hitting Enter':
    'Termina haciendo clic en el punto inicial, doble clic o Intro',
  'Click to start the line, then click to add each vertex':
    'Haz clic para iniciar la línea y luego añade cada vértice',
  'End a line by double-clicking or hitting Enter':
    'Termina la línea con doble clic o Intro',
  'Resizing a rectangle. Hold Cmd to edit as a polygon.':
    'Redimensionando un rectángulo. Mantén Cmd para editarlo como polígono.',

  // Panels and editor
  Table: 'Tabla',
  JSON: 'JSON',
  List: 'Lista',
  'Feature Editor': 'Editor de features',
  Properties: 'Propiedades',
  Styles: 'Estilos',
  ID: 'ID',
  'Show all': 'Mostrar todo',
  Name: 'Nombre',
  Value: 'Valor',
  'New key': 'Nueva clave',
  'New value': 'Nuevo valor',
  'Marker color': 'Color del marcador',
  'Marker size': 'Tamaño del marcador',
  'Marker symbol': 'Símbolo del marcador',
  Small: 'Pequeño',
  Medium: 'Mediano',
  Large: 'Grande',
  Stroke: 'Borde',
  'Stroke opacity': 'Opacidad del borde',
  'Stroke width': 'Grosor del borde',
  Fill: 'Relleno',
  'Fill opacity': 'Opacidad del relleno',
  'Search icons.': 'Buscar iconos.',
  'Search icons…': 'Buscar iconos…',
  'for your changes to be seen on the map.':
    'para que tus cambios se vean en el mapa.',
  'Show all possible properties from all features, even if they aren’t defined on this feature.':
    'Mostrar todas las propiedades posibles de todas las features, aunque no estén definidas en esta feature.',
  'The current map symbolization has literal styles disabled.':
    'La simbolización actual del mapa tiene los estilos literales desactivados.',
  'Enable literal styles': 'Activar estilos literales',
  'Label:': 'Etiqueta:',
  'Label property': 'Propiedad de etiqueta',
  'Zoom to all': 'Acercar a todo',
  'Delete all features': 'Eliminar todas las features',
  'Choose a property from your data which will show up as a label for each feature on the map and in this list.':
    'Elige una propiedad de tus datos para mostrarla como etiqueta en el mapa y en esta lista.',
  'To get started, draw features on the map using the drawing tools above or import spatial data from a file.':
    'Para empezar, dibuja features en el mapa con las herramientas superiores o importa datos espaciales desde un archivo.',

  // Search and common actions
  Search: 'Buscar',
  Copy: 'Copiar',
  Copied: 'Copiado',
  'Copied link': 'Enlace copiado',
  'Copy URL': 'Copiar URL',
  Close: 'Cerrar',
  Cancel: 'Cancelar',
  Save: 'Guardar',
  Apply: 'Aplicar',
  Done: 'Hecho',
  Back: 'Atrás',
  Next: 'Siguiente',
  Retry: 'Reintentar',
  Remove: 'Eliminar',
  Delete: 'Eliminar',
  Rename: 'Renombrar',
  Edit: 'Editar',
  Add: 'Añadir',
  'Add Layer': 'Añadir capa',
  'An error occurred': 'Ha ocurrido un error',
  'Try again': 'Intentar de nuevo',
  'Sorry, an unexpected error occurred. Please try again.':
    'Lo sentimos, ha ocurrido un error inesperado. Inténtalo de nuevo.',
  'Loading.': 'Cargando.',
  'Loading…': 'Cargando…',
  'Searching…': 'Buscando…',
  'Generating link…': 'Generando enlace…',
  'Copying…': 'Copiando…',
  'Failed to copy. Try again?': 'No se pudo copiar. ¿Intentar de nuevo?',
  'Dataset too large to share via URL':
    'El conjunto de datos es demasiado grande para compartirlo por URL',

  // Basemap popover
  Light: 'Claro',
  Dark: 'Oscuro',
  Satellite: 'Satélite',
  Standard: 'Estándar',
  Outdoors: 'Exterior',
  'Show map labels': 'Mostrar etiquetas del mapa',
  'Show 3D features': 'Mostrar elementos 3D',
  Projection: 'Proyección',
  Globe: 'Globo',
  Mercator: 'Mercator',
  'Raster Layers': 'Capas ráster',
  'Add raster layer': 'Añadir capa ráster',
  'Raster layer removed': 'Capa ráster eliminada',
  'Drag to reorder': 'Arrastrar para reordenar',
  'Hide layer': 'Ocultar capa',
  'Show layer': 'Mostrar capa',
  'Edit layer': 'Editar capa',
  'Delete layer': 'Eliminar capa',
  'Use Globe projection': 'Usar proyección globo',
  'Select Light': 'Seleccionar Claro',
  'Select Dark': 'Seleccionar Oscuro',
  'Select Satellite': 'Seleccionar Satélite',
  'Select Standard': 'Seleccionar Estándar',
  'Select Outdoors': 'Seleccionar Exterior',

  // Context actions
  Operations: 'Operaciones',
  Measurements: 'Mediciones',
  'Geometry information': 'Información de geometría',
  Duplicate: 'Duplicar',
  'Zoom to': 'Acercar a',
  'Zoom to feature': 'Acercar a la feature',
  'Zoom to selection': 'Acercar a la selección',
  'Copy as GeoJSON': 'Copiar como GeoJSON',
  'Copy as WKT': 'Copiar como WKT',
  'Convert to': 'Convertir a',
  'Move to': 'Mover a',
  'Add to': 'Añadir a',
  'Select all': 'Seleccionar todo',
  'Clear selection': 'Limpiar selección',
  'Delete selection': 'Eliminar selección',
  'No features selected': 'No hay features seleccionadas',

  // Import / export
  'Import a file': 'Importar un archivo',
  'Import from URL': 'Importar desde URL',
  'Import URL': 'Importar URL',
  'Open files': 'Abrir archivos',
  'Drop files to add to the map': 'Suelta archivos para añadirlos al mapa',
  'Choose a file': 'Elegir un archivo',
  'Export data': 'Exportar datos',
  'Export {count} features': 'Exportar {count} features',
  'Advanced options': 'Opciones avanzadas',
  'Export format': 'Formato de exportación',
  'Export options': 'Opciones de exportación',
  'File name': 'Nombre del archivo',
  'Download': 'Descargar',
  'Paste data': 'Pegar datos',
  'Paste GeoJSON': 'Pegar GeoJSON',
  'From file': 'Desde archivo',
  'From URL': 'Desde URL',
  'Import options': 'Opciones de importación',
  Skip: 'Omitir',
  'Continue': 'Continuar',
  'Invalid file': 'Archivo no válido',
  'Unsupported file type': 'Tipo de archivo no compatible',
  'Reading file…': 'Leyendo archivo…',
  'Importing…': 'Importando…',
  'Exporting…': 'Exportando…',

  // Share
  'Share this link to load the current data in geovizor. The data is encoded directly in the URL — no account or upload required.':
    'Comparte este enlace para cargar los datos actuales en geovizor. Los datos van codificados en la URL; no hace falta cuenta ni subir archivos.',
  'The current dataset is too large to share via URL. Share links are limited to {count} characters. Try reducing the number of features or simplifying geometry.':
    'El conjunto de datos es demasiado grande para compartirlo por URL. Los enlaces están limitados a {count} caracteres. Reduce el número de features o simplifica la geometría.',
  'This URL is over {count} characters. Very long URLs may not work in all browsers or apps.':
    'Esta URL supera los {count} caracteres. Las URLs muy largas pueden no funcionar en todos los navegadores o aplicaciones.',

  // Dialogs
  'About': 'Acerca de',
  'Circle types': 'Tipos de círculo',
  'Casting property type': 'Convertir tipo de propiedad',
  'Buffer': 'Búfer',
  'Simplify': 'Simplificar',
  'Raster layer': 'Capa ráster',
  'Edit raster layer': 'Editar capa ráster',
  'Add WMS layer': 'Añadir capa WMS',
  'WMS URL': 'URL WMS',
  'Layer name': 'Nombre de la capa',
  'Tile URL': 'URL de teselas',
  'Opacity': 'Opacidad',
  'Radius': 'Radio',
  'Units': 'Unidades',
  'Tolerance': 'Tolerancia',
  'High quality': 'Alta calidad',
  'Precision': 'Precisión',
  'Create': 'Crear',
  'Save changes': 'Guardar cambios',
  'Delete property': 'Eliminar propiedad',
  'Rename property': 'Renombrar propiedad',
  'Rename column': 'Renombrar columna',
  'Property name': 'Nombre de propiedad',
  'Add property': 'Añadir propiedad',
  'Add column': 'Añadir columna',
  'No data': 'Sin datos',
  'No results found': 'No se encontraron resultados',
  'Search places': 'Buscar lugares',
  'Search for a place': 'Buscar un lugar',

  // Misc
  'Select a feature to edit': 'Selecciona una feature para editar',
  'Select one or more features': 'Selecciona una o más features',
  'No feature selected': 'Ninguna feature seleccionada',
  'Feature': 'Feature',
  'Features': 'Features',
  'Point': 'Punto',
  'LineString': 'Línea',
  'Polygon': 'Polígono',
  'MultiPoint': 'Multipunto',
  'MultiLineString': 'Multilínea',
  'MultiPolygon': 'Multipolígono',
  'GeometryCollection': 'Colección de geometrías',
  'Null geometry': 'Geometría nula',
  'Visibility': 'Visibilidad',
  'Toggle visibility': 'Alternar visibilidad',
  'Color': 'Color',
  'Size': 'Tamaño',
  'Symbol': 'Símbolo',
  'Style': 'Estilo',
  'Settings': 'Ajustes',
  'Language': 'Idioma',
  'English': 'Inglés',
  'Spanish': 'Español'
};

export function translate(
  text: string,
  language: Language,
  vars?: Vars
): string {
  const template = language === 'es' ? es[text] ?? text : text;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    return Object.prototype.hasOwnProperty.call(vars, key)
      ? String(vars[key])
      : match;
  });
}

export function useT() {
  const language = useAtomValue(languageAtom);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return useCallback(
    (text: string, vars?: Vars) => translate(text, language, vars),
    [language]
  );
}
