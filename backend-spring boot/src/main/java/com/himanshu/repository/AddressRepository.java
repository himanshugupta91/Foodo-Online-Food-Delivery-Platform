package com.himanshu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
