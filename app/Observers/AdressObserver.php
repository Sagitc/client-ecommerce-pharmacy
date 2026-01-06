<?php

namespace App\Observers;

use App\Models\Address;

class AddressObserver
{
    /**
     * Handle the Address "created" event.
     */
    public function created(Address $address): void
    {
        //
    }

    /**
     * Handle the Adress "updated" event.
     */
    public function updated(Address $address): void
    {
        //
    }

    /**
     * Handle the Adress "deleted" event.
     */
    public function deleted(Address $address): void
    {
        //
    }

    /**
     * Handle the Adress "restored" event.
     */
    public function restored(Address $address): void
    {
        //
    }

    /**
     * Handle the Adress "force deleted" event.
     */
    public function forceDeleted(Address $address): void
    {
        //
    }

    public function saving(Address $address)
    {
        // Se o endereço atual está sendo definido como padrão
        if ($address->is_default) {
            // Remove o padrão de todos os outros endereços DESTE usuário
            Address::where('user_id', $address->user_id)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }
    }
}
