import axios from 'axios';


/** ---- INTERFACE ---- */

interface MetadataApiResponse {
    error: string | null;
    metadatas: [] | Array<{
        id: string;
        label: string;
        category_id: number;
        metadata_values?: Array<{
            id: number;
            category_metadata_id: number;
            label: string;
        }>;
    }>;
}


/** ---- API CALLS ---- */


export async function fetchMetadatasByCategory($categoryLabel: string): Promise<MetadataApiResponse> {
    try {
        const response = await axios.get<MetadataApiResponse>(`/metadata/category/${$categoryLabel}`, {});
        return response.data;
    } catch (e) {
        console.error('Error fetching metadatas by category:', e);
        throw new Error('Failed to fetch metadatas by category');
    }
}


export async function fetchMetadatasByProduct($productId: number): Promise<MetadataApiResponse> {
    try {
        const response = await axios.get<MetadataApiResponse>(`/metadata/product/${$productId}`, {});
        return response.data;
    } catch (e) {
        console.error('Error fetching metadatas by product:', e);
        throw new Error('Failed to fetch metadatas by product');
    }
}


export async function fetchAllMetadatas(): Promise<MetadataApiResponse> {
    try {
        const response = await axios.get<MetadataApiResponse>('/metadata', {});
        return response.data;
    } catch (e) {
        console.error('Error fetching all metadatas:', e);
        throw new Error('Failed to fetch all metadatas');
    }
}


export async function fetchMetadataValues(metadataId: number): Promise<MetadataApiResponse> {
    try {
        const response = await axios.get<MetadataApiResponse>(`/metadata/${metadataId}`, {});
        return response.data;
    } catch (e) {
        console.error('Error fetching metadata values:', e);
        throw new Error('Failed to fetch metadata values');
    }
}