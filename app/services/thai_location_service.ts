import NotFoundException from "#exceptions/notfound_exception"
import ThaiAmphure from "#models/thai_amphure"
import ThaiGeography from "#models/thai_geography"
import ThaiProvince from "#models/thai_province"
import ThaiTambon from "#models/thai_tambon"

const getGeographies = async () => {
    const geographies = await ThaiGeography.query().select('id', 'name')
    return geographies
}

const getProvinces = async (geographyId: number | null = null) => {
    const provinces = await ThaiProvince.query()
        .select('id', 'nameEn', 'nameTh')
        .if(geographyId, (query) => query.where('geographyId', geographyId!))
    return provinces
}

// Small to big
const getAmphureByTambonId = async (tambonId: number) => {
    const tambon = await ThaiTambon.query()
        .where('id', tambonId)
        .preload('amphure')
        .firstOrFail()

    if (!tambon.amphure) {
        throw new NotFoundException('No amphure found for this tambon')
    }
    return tambon.amphure
}

const getProvinceByAmphureId = async (amphureId: number) => {
    const amphure = await ThaiAmphure.query()
        .where('id', amphureId)
        .preload('province')
        .firstOrFail()

    if (!amphure.province) {
        throw new NotFoundException('No province found for this amphure')
    }
    return amphure.province
}

const getGeographyByProvinceId = async (provinceId: number) => {
    const province = await ThaiProvince.query()
        .where('id', provinceId)
        .preload('geography')
        .firstOrFail()

    if (!province.geography) {
        throw new NotFoundException('No geography found for this province')
    }
    return province.geography
}

// Big to small
const getProvincesByGeographyId = async (geographyId: number) => {
    const geography = await ThaiGeography.query()
        .where('id', geographyId)
        .preload('provinces')
        .firstOrFail()

    if (geography.provinces.length === 0) {
        throw new NotFoundException('No province found for this geography')
    }
    console.log(geography.provinces)
    return geography.provinces
}

const getAmphuresByProvinceId = async (provinceId: number) => {
    const province = await ThaiProvince.query()
        .where('id', provinceId)
        .preload('amphures')
        .firstOrFail()

    if (province.amphures.length === 0) {
        throw new NotFoundException('No amphure found for this province')
    }
    return province.amphures
}

const getTambonsByAmphureId = async (amphureId: number) => {
    const amphure = await ThaiAmphure.query()
        .where('id', amphureId)
        .preload('tambons')
        .firstOrFail()

    if (amphure.tambons.length === 0) {
        throw new NotFoundException('No tambon found for this amphure')
    }
    return amphure.tambons
}

// Validator
const validateProvinceInGeo = async (
    geographyId: number | string | null = null,
    provinceId: number | string | null = null
) => {
    const success = { isSuccess: true, message: 'Success' }
    let fail = { isSuccess: false, message: '' }

    if (geographyId && provinceId) {
        const provinces = await getProvincesByGeographyId(Number(geographyId))
        console.log(provinces)

        const isInProvinces = provinces.some(province => province.id === Number(provinceId))

        if (isInProvinces) {
            return success
        } else {
            fail.message = 'Province is not in this geography.'
            return fail
        }
    }

    return success
}

export default {
    getProvinces,
    getGeographies,

    getAmphureByTambonId,
    getProvinceByAmphureId,
    getGeographyByProvinceId,

    getProvincesByGeographyId,
    getAmphuresByProvinceId,
    getTambonsByAmphureId,

    validateProvinceInGeo
}
