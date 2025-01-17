import {computed, ref, watch} from 'vue'
import type dayjs from 'dayjs'

import {i18n, type ISOLanguage, type SupportedLocale} from '@/i18n'

export const DAYJS_LOCALE_MAPPING = {
	'de-de': 'de',
	'de-swiss': 'de-at',
	'ru-ru': 'ru',
	'fr-fr': 'fr',
	'vi-vn': 'vi',
	'it-it': 'it',
	'cs-cz': 'cs',
	'pl-pl': 'pl',
	'nl-nl': 'nl',
	'pt-pt': 'pt',
	'zh-cn': 'zh-cn',
	'no-NO': 'nn',
	'es-ES': 'es',
	'da-DK': 'da',
	'ja-JP': 'ja',
	'hu-HU': 'hu',
	'ar-SA': 'ar-sa',
	'sl-SI': 'sl',
	'pt-BR': 'pt',
	'hr-HR': 'hr',
} as Record<SupportedLocale, ISOLanguage>

export const DAYJS_LANGUAGE_IMPORTS = {
	'de-de': () => import('dayjs/locale/de'),
	'de-swiss': () => import('dayjs/locale/de-at'),
	'ru-ru': () => import('dayjs/locale/ru'),
	'fr-fr': () => import('dayjs/locale/fr'),
	'vi-vn': () => import('dayjs/locale/vi'),
	'it-it': () => import('dayjs/locale/it'),
	'cs-cz': () => import('dayjs/locale/cs'),
	'pl-pl': () => import('dayjs/locale/pl'),
	'nl-nl': () => import('dayjs/locale/nl'),
	'pt-pt': () => import('dayjs/locale/pt'),
	'zh-cn': () => import('dayjs/locale/zh-cn'),
	'no-no': () => import('dayjs/locale/nn'),
	'es-es': () => import('dayjs/locale/es'),
	'da-dk': () => import('dayjs/locale/da'),
	'ja-jp': () => import('dayjs/locale/ja'),
	'hu-hu': () => import('dayjs/locale/hu'),
	'ar-sa': () => import('dayjs/locale/ar-sa'),
	'sl-si': () => import('dayjs/locale/sl'),
	'pt-br': () => import('dayjs/locale/pt-br'),
} as Record<SupportedLocale, () => Promise<ILocale>>

export function useDayjsLanguageSync(dayjsGlobal: typeof dayjs) {

	const dayjsLanguageLoaded = ref(false)
	watch(
		() => i18n.global.locale.value,
		async (currentLanguage: string) => {
			if (!dayjsGlobal) {
				return
			}
			const dayjsLanguageCode = DAYJS_LOCALE_MAPPING[currentLanguage.toLowerCase()] || currentLanguage.toLowerCase()
			dayjsLanguageLoaded.value = dayjsGlobal.locale() === dayjsLanguageCode
			if (dayjsLanguageLoaded.value) {
				return
			}
			await DAYJS_LANGUAGE_IMPORTS[currentLanguage.toLowerCase()]()
			dayjsGlobal.locale(dayjsLanguageCode)
			dayjsLanguageLoaded.value = true
		},
		{immediate: true},
	)

	// we export the loading state since that's easier to work with
	const isLoading = computed(() => !dayjsLanguageLoaded.value)

	return isLoading
}