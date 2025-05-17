'use client'

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';

interface AlertProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

import React from 'react'
import { Button } from '../ui/button';

export const AlertModal = ({isOpen, onClose, onConfirm, loading}: AlertProps) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null
    }

  return (
    <>
        <Modal
            title='Are you sure?'
            description='This action cannot be undone.'
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button disabled={loading} variant='outline' onClick={onClose}>
                    Cancle
                </Button>
                <Button disabled={loading} variant='destructive' onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    </>
  )
}

