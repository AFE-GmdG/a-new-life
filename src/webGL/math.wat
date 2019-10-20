(module
	(memory (export "mem") 1)

	;; Da $l und $r und $out immer an der selben stelle im Speicher liegen,
	;; kann ich alle Adressberechnungen entfernen. Somit entfallen auch die Parameter.
	(func (export "m44m44mul") ;; (param $r i32) (param $l i32) (param $out i32)
		;; l[ 0] =   0   l[ 4] =  16   l[ 8] =  32   l[12] =  48
		;; l[ 1] =   4   l[ 5] =  20   l[ 9] =  36   l[13] =  52
		;; l[ 2] =   8   l[ 6] =  24   l[10] =  40   l[14] =  56
		;; l[ 3] =  12   l[ 7] =  28   l[11] =  44   l[15] =  60

		;; r[ 0] =  64   r[ 4] =  80   r[ 8] =  96   r[12] = 112
		;; r[ 1] =  68   r[ 5] =  84   r[ 9] = 100   r[13] = 116
		;; r[ 2] =  72   r[ 6] =  88   r[10] = 104   r[14] = 120
		;; r[ 3] =  76   r[ 7] =  92   r[11] = 108   r[15] = 124

		;; o[ 0] = 128   o[ 4] = 144   o[ 8] = 160   o[12] = 176
		;; o[ 1] = 132   o[ 5] = 148   o[ 9] = 164   o[13] = 180
		;; o[ 2] = 136   o[ 6] = 152   o[10] = 168   o[14] = 184
		;; o[ 3] = 140   o[ 7] = 156   o[11] = 172   o[15] = 188

		;; out._[0] = l._[0] * r._[0] + l._[4] * r._[1] + l._[8] * r._[2] + l._[12] * r._[3];
		(f32.store
			(i32.const 128)
			(f32.add
				(f32.add
					(f32.add
						;; l._[0] * r._[0]
						(f32.mul
							(f32.load	(i32.const   0))
							(f32.load (i32.const  64))
						)
						;; l._[4] * r._[1]
						(f32.mul
							(f32.load	(i32.const  16))
							(f32.load (i32.const  68))
						)
					)
					;; l._[8] * r._[2]
					(f32.mul
						(f32.load	(i32.const  32))
						(f32.load (i32.const  72))
					)
				)
				;; l._[12] * r._[3]
				(f32.mul
					(f32.load	(i32.const  48))
					(f32.load (i32.const  76))
				)
			)
		)
		;; out._[1] = l._[1] * r._[0] + l._[5] * r._[1] + l._[9] * r._[2] + l._[13] * r._[3];
		(f32.store
			(i32.const 132)
			(f32.add
				(f32.add
					(f32.add
						;; l._[1] * r._[0]
						(f32.mul
							(f32.load	(i32.const   4))
							(f32.load (i32.const  64))
						)
						;; l._[5] * r._[1]
						(f32.mul
							(f32.load	(i32.const  20))
							(f32.load (i32.const  68))
						)
					)
					;; l._[9] * r._[2]
					(f32.mul
						(f32.load	(i32.const  36))
						(f32.load (i32.const  72))
					)
				)
				;; l._[13] * r._[3]
				(f32.mul
					(f32.load	(i32.const  52))
					(f32.load (i32.const  76))
				)
			)
		)
		;; out._[2] = l._[2] * r._[0] + l._[6] * r._[1] + l._[10] * r._[2] + l._[14] * r._[3];
		(f32.store
			(i32.const 136)
			(f32.add
				(f32.add
					(f32.add
						;; l._[2] * r._[0]
						(f32.mul
							(f32.load	(i32.const   8))
							(f32.load (i32.const  64))
						)
						;; l._[6] * r._[1]
						(f32.mul
							(f32.load	(i32.const  24))
							(f32.load (i32.const  68))
						)
					)
					;; l._[10] * r._[2]
					(f32.mul
						(f32.load	(i32.const  40))
						(f32.load (i32.const  72))
					)
				)
				;; l._[14] * r._[3]
				(f32.mul
					(f32.load	(i32.const  56))
					(f32.load (i32.const  76))
				)
			)
		)
		;; out._[3] = l._[3] * r._[0] + l._[7] * r._[1] + l._[11] * r._[2] + l._[15] * r._[3];
		(f32.store
			(i32.const 140)
			(f32.add
				(f32.add
					(f32.add
						;; l._[3] * r._[0]
						(f32.mul
							(f32.load	(i32.const  12))
							(f32.load (i32.const  64))
						)
						;; l._[7] * r._[1]
						(f32.mul
							(f32.load	(i32.const  28))
							(f32.load (i32.const  68))
						)
					)
					;; l._[11] * r._[2]
					(f32.mul
						(f32.load	(i32.const  44))
						(f32.load (i32.const  72))
					)
				)
				;; l._[15] * r._[3]
				(f32.mul
					(f32.load	(i32.const  60))
					(f32.load (i32.const  76))
				)
			)
		)
		;; out._[4] = l._[0] * r._[4] + l._[4] * r._[5] + l._[8] * r._[6] + l._[12] * r._[7];
		(f32.store
			(i32.const 144)
			(f32.add
				(f32.add
					(f32.add
						;; l._[0] * r._[4]
						(f32.mul
							(f32.load	(i32.const   0))
							(f32.load (i32.const  80))
						)
						;; l._[4] * r._[5]
						(f32.mul
							(f32.load	(i32.const  16))
							(f32.load (i32.const  84))
						)
					)
					;; l._[8] * r._[6]
					(f32.mul
						(f32.load	(i32.const  32))
						(f32.load (i32.const  88))
					)
				)
				;; l._[12] * r._[7]
				(f32.mul
					(f32.load	(i32.const  48))
					(f32.load (i32.const  92))
				)
			)
		)
		;; out._[5] = l._[1] * r._[4] + l._[5] * r._[5] + l._[9] * r._[6] + l._[13] * r._[7];
		(f32.store
			(i32.const 148)
			(f32.add
				(f32.add
					(f32.add
						;; l._[1] * r._[4]
						(f32.mul
							(f32.load	(i32.const   4))
							(f32.load (i32.const  80))
						)
						;; l._[5] * r._[5]
						(f32.mul
							(f32.load	(i32.const  20))
							(f32.load (i32.const  84))
						)
					)
					;; l._[9] * r._[6]
					(f32.mul
						(f32.load	(i32.const  36))
						(f32.load (i32.const  88))
					)
				)
				;; l._[13] * r._[7]
				(f32.mul
					(f32.load	(i32.const  52))
					(f32.load (i32.const  92))
				)
			)
		)
		;; out._[6] = l._[2] * r._[4] + l._[6] * r._[5] + l._[10] * r._[6] + l._[14] * r._[7];
		(f32.store
			(i32.const 152)
			(f32.add
				(f32.add
					(f32.add
						;; l._[2] * r._[4]
						(f32.mul
							(f32.load	(i32.const   8))
							(f32.load (i32.const  80))
						)
						;; l._[6] * r._[5]
						(f32.mul
							(f32.load	(i32.const  24))
							(f32.load (i32.const  84))
						)
					)
					;; l._[10] * r._[6]
					(f32.mul
						(f32.load	(i32.const  40))
						(f32.load (i32.const  88))
					)
				)
				;; l._[14] * r._[7]
				(f32.mul
					(f32.load	(i32.const  56))
					(f32.load (i32.const  92))
				)
			)
		)
		;; out._[7] = l._[3] * r._[4] + l._[7] * r._[5] + l._[11] * r._[6] + l._[15] * r._[7];
		(f32.store
			(i32.const 156)
			(f32.add
				(f32.add
					(f32.add
						;; l._[3] * r._[4]
						(f32.mul
							(f32.load	(i32.const  12))
							(f32.load (i32.const  80))
						)
						;; l._[7] * r._[5]
						(f32.mul
							(f32.load	(i32.const  28))
							(f32.load (i32.const  84))
						)
					)
					;; l._[11] * r._[6]
					(f32.mul
						(f32.load	(i32.const  44))
						(f32.load (i32.const  88))
					)
				)
				;; l._[15] * r._[7]
				(f32.mul
					(f32.load	(i32.const  60))
					(f32.load (i32.const  92))
				)
			)
		)
		;; out._[8] = l._[0] * r._[8] + l._[4] * r._[9] + l._[8] * r._[10] + l._[12] * r._[11];
		(f32.store
			(i32.const 160)
			(f32.add
				(f32.add
					(f32.add
						;; l._[0] * r._[8]
						(f32.mul
							(f32.load	(i32.const   0))
							(f32.load (i32.const  96))
						)
						;; l._[4] * r._[9]
						(f32.mul
							(f32.load	(i32.const  16))
							(f32.load (i32.const 100))
						)
					)
					;; l._[8] * r._[10]
					(f32.mul
						(f32.load	(i32.const  32))
						(f32.load (i32.const 104))
					)
				)
				;; l._[12] * r._[11]
				(f32.mul
					(f32.load	(i32.const  48))
					(f32.load (i32.const 108))
				)
			)
		)
		;; out._[9] = l._[1] * r._[8] + l._[5] * r._[9] + l._[9] * r._[10] + l._[13] * r._[11];
		(f32.store
			(i32.const 164)
			(f32.add
				(f32.add
					(f32.add
						;; l._[1] * r._[8]
						(f32.mul
							(f32.load	(i32.const   4))
							(f32.load (i32.const  96))
						)
						;; l._[5] * r._[9]
						(f32.mul
							(f32.load	(i32.const  20))
							(f32.load (i32.const 100))
						)
					)
					;; l._[9] * r._[10]
					(f32.mul
						(f32.load	(i32.const  36))
						(f32.load (i32.const 104))
					)
				)
				;; l._[13] * r._[11]
				(f32.mul
					(f32.load	(i32.const  52))
					(f32.load (i32.const 108))
				)
			)
		)
		;; out._[10] = l._[2] * r._[8] + l._[6] * r._[9] + l._[10] * r._[10] + l._[14] * r._[11];
		(f32.store
			(i32.const 168)
			(f32.add
				(f32.add
					(f32.add
						;; l._[2] * r._[8]
						(f32.mul
							(f32.load	(i32.const   8))
							(f32.load (i32.const  96))
						)
						;; l._[6] * r._[9]
						(f32.mul
							(f32.load	(i32.const  24))
							(f32.load (i32.const 100))
						)
					)
					;; l._[10] * r._[10]
					(f32.mul
						(f32.load	(i32.const  40))
						(f32.load (i32.const 104))
					)
				)
				;; l._[14] * r._[11]
				(f32.mul
					(f32.load	(i32.const  56))
					(f32.load (i32.const 108))
				)
			)
		)
		;; out._[11] = l._[3] * r._[8] + l._[7] * r._[9] + l._[11] * r._[10] + l._[15] * r._[11];
		(f32.store
			(i32.const 172)
			(f32.add
				(f32.add
					(f32.add
						;; l._[3] * r._[8]
						(f32.mul
							(f32.load	(i32.const  12))
							(f32.load (i32.const  96))
						)
						;; l._[7] * r._[9]
						(f32.mul
							(f32.load	(i32.const  28))
							(f32.load (i32.const 100))
						)
					)
					;; l._[11] * r._[10]
					(f32.mul
						(f32.load	(i32.const  44))
						(f32.load (i32.const 104))
					)
				)
				;; l._[15] * r._[11]
				(f32.mul
					(f32.load	(i32.const  60))
					(f32.load (i32.const 108))
				)
			)
		)
		;; out._[12] = l._[0] * r._[12] + l._[4] * r._[13] + l._[8] * r._[14] + l._[12] * r._[15];
		(f32.store
			(i32.const 176)
			(f32.add
				(f32.add
					(f32.add
						;; l._[0] * r._[12]
						(f32.mul
							(f32.load	(i32.const   0))
							(f32.load (i32.const 112))
						)
						;; l._[4] * r._[13]
						(f32.mul
							(f32.load	(i32.const  16))
							(f32.load (i32.const 116))
						)
					)
					;; l._[8] * r._[14]
					(f32.mul
						(f32.load	(i32.const  32))
						(f32.load (i32.const 120))
					)
				)
				;; l._[12] * r._[15]
				(f32.mul
					(f32.load	(i32.const  48))
					(f32.load (i32.const 124))
				)
			)
		)
		;; out._[13] = l._[1] * r._[12] + l._[5] * r._[13] + l._[9] * r._[14] + l._[13] * r._[15];
		(f32.store
			(i32.const 180)
			(f32.add
				(f32.add
					(f32.add
						;; l._[1] * r._[12]
						(f32.mul
							(f32.load	(i32.const   4))
							(f32.load (i32.const 112))
						)
						;; l._[5] * r._[13]
						(f32.mul
							(f32.load	(i32.const  20))
							(f32.load (i32.const 116))
						)
					)
					;; l._[9] * r._[14]
					(f32.mul
						(f32.load	(i32.const  36))
						(f32.load (i32.const 120))
					)
				)
				;; l._[13] * r._[15]
				(f32.mul
					(f32.load	(i32.const  52))
					(f32.load (i32.const 124))
				)
			)
		)
		;; out._[14] = l._[2] * r._[12] + l._[6] * r._[13] + l._[10] * r._[14] + l._[14] * r._[15];
		(f32.store
			(i32.const 184)
			(f32.add
				(f32.add
					(f32.add
						;; l._[2] * r._[12]
						(f32.mul
							(f32.load	(i32.const   8))
							(f32.load (i32.const 112))
						)
						;; l._[6] * r._[13]
						(f32.mul
							(f32.load	(i32.const  24))
							(f32.load (i32.const 116))
						)
					)
					;; l._[10] * r._[14]
					(f32.mul
						(f32.load	(i32.const  40))
						(f32.load (i32.const 120))
					)
				)
				;; l._[14] * r._[15]
				(f32.mul
					(f32.load	(i32.const  56))
					(f32.load (i32.const 124))
				)
			)
		)
		;; out._[15] = l._[3] * r._[12] + l._[7] * r._[13] + l._[11] * r._[14] + l._[15] * r._[15];
		(f32.store
			(i32.const 188)
			(f32.add
				(f32.add
					(f32.add
						;; l._[3] * r._[12]
						(f32.mul
							(f32.load	(i32.const  12))
							(f32.load (i32.const 112))
						)
						;; l._[7] * r._[13]
						(f32.mul
							(f32.load	(i32.const  28))
							(f32.load (i32.const 116))
						)
					)
					;; l._[11] * r._[14]
					(f32.mul
						(f32.load	(i32.const  44))
						(f32.load (i32.const 120))
					)
				)
				;; l._[15] * r._[15]
				(f32.mul
					(f32.load	(i32.const  60))
					(f32.load (i32.const 124))
				)
			)
		)
	) ;; func m44m44mul
) ;; module
