import { redirect } from 'next/navigation';

/**
 * El editor standalone (generador.html con iframe) quedó DEPRECADO.
 * Ahora existe un ÚNICO editor integrado: /dashboard/[menuId].
 *
 * Si un usuario tenía este enlace guardado, lo mandamos al dashboard
 * principal para que cree un menú nuevo o edite uno existente.
 */
export default function GeneradorPage() {
  redirect('/dashboard?from=generador');
}
